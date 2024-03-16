import pg from 'pg';
import slugify from 'slugify';
import { DatabaseTask, DatabaseTaskTag, DatabaseTaskType, Task } from '../types.js';
import { environment } from './environment.js';
import { ILogger, logger as loggerSingleton } from './logger.js';

const MAX_TASKS = 100;

/**
 * Database class.
 */
export class Database {
  private connectionString: string;
  private logger: ILogger;
  private pool: pg.Pool | null = null;

  /**
   * Create a new database connection.
   */
  constructor(connectionString: string, logger: ILogger) {
    this.connectionString = connectionString;
    this.logger = logger;
  }

  open() {
    this.pool = new pg.Pool({ connectionString: this.connectionString });

    this.pool.on('error', (err) => {
      this.logger.error('error in database pool', err);
      this.close();
    });
  }

  /**
   * Close the database connection.
   */
  async close(): Promise<boolean> {
    if (!this.pool) {
      this.logger.error('unable to close database connection that is not open');
      return false;
    }

    try {
      await this.pool.end();
      return true;
    } catch (e) {
      this.logger.error('error closing database pool', { error: e });
      return false;
    } finally {
      this.pool = null;
    }
  }

  /**
   * Connect to the database via the pool.
   */
  async connect(): Promise<pg.PoolClient | null> {
    if (!this.pool) {
      this.logger.error('Reynt að nota gagnagrunn sem er ekki opinn');
      return null;
    }

    try {
      const client = await this.pool.connect();
      return client;
    } catch (e) {
      this.logger.error('error connecting to db', { error: e });
      return null;
    }
  }

  /**
   * Run a query on the database.
   * @param query SQL query.
   * @param values Parameters for the query.
   * @returns Result of the query.
   */
  async query(
    query: string,
    values: Array<string | number> = [],
  ): Promise<pg.QueryResult | null> {
    const client = await this.connect();

    if (!client) {
      return null;
    }

    try {
      const result = await client.query(query, values);
      return result;
    } catch (e) {
      this.logger.error('Error running query', e);
      return null;
    } finally {
      client.release();
    }
  }

  /**
   * Get á TaskType from the database.
   * @param slug slug of the task type
   * @returns TaskType or null if not found
   */
  async getTaskType(slug: string): Promise<DatabaseTaskType | null> {
    const q = 'SELECT id, name FROM task_types WHERE slug = $1';
    const result = await this.query(q, [slug]);

    if (result && result.rows.length === 1) {
      const row = result.rows[0];
      const task_type: DatabaseTaskType = {
        id: row.id,
        name: row.name,
        slug: slug
      };
      return task_type;
    }

    return null;
  }

  /**
   * Get á TaskTag from the database.
   * @param slug slug of the task tag
   * @returns TaskTag or null if not found
   */
  async getTaskTag(slug: string): Promise<DatabaseTaskTag | null> {
    const q = 'SELECT id, name FROM task_tags WHERE slug = $1';
    const result = await this.query(q, [slug]);

    if (result && result.rows.length === 1) {
      const row = result.rows[0];
      const task_tag: DatabaseTaskTag = {
        id: row.id,
        name: row.name,
        slug: slug
      };
      return task_tag;
    }

    return null;
  }

  /**
   * Get task types from the database.
   */
  async getTaskTypes() {
    const q = 'SELECT id, name FROM task_types';
    const result = await this.query(q);

    const task_types: Array<DatabaseTaskType> = [];
    if (result && (result.rows?.length ?? 0) > 0) {
      for (const row of result.rows) {
        const task_type: DatabaseTaskType = {
          id: row.id,
          name: row.name,
          slug: row.slug
        };
        task_types.push(task_type);
      }

      return task_types;
    }

    return null;
  }

  /**
   * Get task tags from the database.
   */
  async getTaskTags() {
    const q = 'SELECT id, name FROM task_tags';
    const result = await this.query(q);

    const task_tags: Array<DatabaseTaskTag> = [];
    if (result && (result.rows?.length ?? 0) > 0) {
      for (const row of result.rows) {
        const task_tag: DatabaseTaskTag = {
          id: row.id,
          name: row.name,
          slug: row.slug
        };
        task_tags.push(task_tag);
      }

      return task_tags;
    }

    return null;
  }

  /**
   * Delete a task type from the database.
   */
  async deleteTaskType(slug: string): Promise<boolean> {
    const result = await this.query('DELETE FROM task_types WHERE slug = $1', [
      slug,
    ]);

    if (!result || result.rowCount !== 1) {
      this.logger.warn('unable to delete task type', { result, slug });
      return false;
    }
    return true;
  }


  async conditionalUpdate(
    table: 'task_types' | 'tasks',
    id: string | number,
    fields: Array<string | null>,
    values: Array<string | number | null>,
  ) {
    const filteredFields = fields.filter((i) => typeof i === 'string');
    const filteredValues = values.filter(
      (i): i is string | number =>
        typeof i === 'string' || typeof i === 'number',
    );

    if (filteredFields.length === 0) {
      return false;
    }

    if (filteredFields.length !== filteredValues.length) {
      throw new Error('fields and values must be of equal length');
    }

    // id is field = 1
    const updates = filteredFields.map((field, i) => `${field} = $${i + 2}`);

    const q = `
      UPDATE ${table}
        SET ${updates.join(', ')}
      WHERE
        id = $1
      RETURNING *
      `;

    const queryValues: Array<string | number> = (
      [id] as Array<string | number>
    ).concat(filteredValues);
    const result = await this.query(q, queryValues);

    return result;
  }

  /**
   * Get tasks from the database.
   * @param {number} [limit=MAX_GAMES] Number of tasks to get.
   */
  async getTasks(limit = MAX_TASKS): Promise<Task[] | null> {
    // Klár skipun enn kanski að breytta array<task> i mapper? - Gísli
    const q = `
      SELECT
        tasks.id as id,
        tasks.name,
        date,
        description,
        task_type.id AS task_type_id,task_type.name AS task_type_name,
        task_tag.id AS task_tag_id,task_tag.name AS task_tag_name
      FROM
        tasks
      LEFT JOIN
        task_types AS task_type ON task_type.id = tasks.task_type
      LEFT JOIN
       task_tags AS task_tag ON task_tag.id = tasks.task_tag
      ORDER BY
        date DESC
      LIMIT $1
    `;

    // Ensure we don't get too many games and that we get at least one
    const usedLimit = Math.min(limit > 0 ? limit : MAX_TASKS, MAX_TASKS);

    const result = await this.query(q, [usedLimit.toString()]);

    const tasks: Array<Task> = [];
    if (result && (result.rows?.length ?? 0) > 0) {
      for (const row of result.rows) {
        const task: Task = {
          id: row.id,
          name: row.name,
          description: row.description,
          date: row.date,
          task_type: {
            id: row.task_type_id,
            name: row.task_type_name,
          },
          task_tag: {
            id: row.task_tag_id,
            name: row.task_tag_name,
          },
          user_id: row.user_id, // ?? getum breytt í fylki með uppl um notanda
        };
        tasks.push(task);
      }

      return tasks;
    }

    return null;
  }

  /**
   * Get a task from the database.
   */
  async getTask(id: string): Promise<Task | null> {
    // ?????? Þarf að laga þessa SQL skipun - Ísak
    const q = `
      SELECT
        tasks.id as id,
        tasks.name,
        date,
        description,
        task_type.id AS task_type_id,task_type.name AS task_type_name,
       task_tag.id AS task_tag_id,task_tag.name AS task_tag_name
      FROM
       tasks
      LEFT JOIN
        task_types AS task_type ON task_type.id = tasks.task_type
      LEFT JOIN
        task_tags AS task_tag ON task_tag.id = tasks.task_tag
      WHERE
        tasks.id = $1
    `;

    const result = await this.query(q, [id]);

    if (result && result.rows.length === 1) {
      const row = result.rows[0];
      const task: Task = {
        id: row.id,
        name: row.name,
        description: row.description,
        date: row.date,
        task_type: {
          id: row.task_type_id,
          name: row.task_type_name,
        },
        task_tag: {
          id: row.task_tag_id,
          name: row.task_tag_name,
        },
        user_id: row.user_id, // ?? getum breytt í fylki með uppl um notanda
      };
      return task;
    }

    return null;
  }

  /**
   * Insert a task type into the database.
   * @param type_name Task type to insert.
   */
  async insertTaskType(
    type_name: string
  ): Promise<DatabaseTaskType | null> {
    const result = await this.query(
      'INSERT INTO task_types (name, slug) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id, name',
      [type_name, slugify(type_name)],
    );
    if (result) {
      const resultTaskTypes: DatabaseTaskType = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        slug: result.rows[0].slug,
      };
      return resultTaskTypes;
    }
    return null;
  }

  /**
   * Insert task types into the database.
   * @param task_types List of teams to insert.
   * @returns List of teams inserted.
   */
  async insertTaskTypes(task_types: string[]): Promise<Array<DatabaseTaskType>> {
    const inserted: Array<DatabaseTaskType> = [];
    for await (const task_type of task_types) {
      const result = await this.insertTaskType(task_type);
      if (result) {
        inserted.push(result);
      } else {
        this.logger.warn('unable to insert task type', { task_type });
      }
    }
    return inserted;
  }

  /**
   * Insert a task into the database.
   */
  async insertTask(task: Omit<DatabaseTask, 'id'>): Promise<Task | null> {
    const q = `
      INSERT INTO
        tasks (name, description, date, task_type, task_tag, user_id)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const result = await this.query(q, [
      task.name,
      task.description,
      task.date,
      task.task_type_id, // ??? .toString() ???
      task.task_tag_id, // ??? .toString() ???
      task.user_id, // ??? .toString() ???
    ]);

    if (!result || result.rowCount !== 1) {
      this.logger.warn('unable to insert task', { result, task });
      return null;
    }
    return this.getTask(result.rows[0].id);
  }

  /**
   * Insert gamedays into the database.
   */
  /*
  async insertGamedays(
    gamedays: Gameday[],
    dbTeams: DatabaseTeam[],
  ): Promise<boolean> {
    if (gamedays.length === 0) {
      this.logger.warn('no gamedays to insert');
      return false;
    }

    if (dbTeams.length === 0) {
      this.logger.warn('no teams to insert');
      return false;
    }

    for await (const gameday of gamedays) {
      for await (const game of gameday.games) {
        const homeId = dbTeams.find((t) => t.name === game.home.name)?.id;
        const awayId = dbTeams.find((t) => t.name === game.away.name)?.id;

        if (!homeId || !awayId) {
          this.logger.warn('unable to find team id', { homeId, awayId });
          continue;
        }

        const result = await this.insertTask({
          date: gameday.date.toISOString(),
          home_id: homeId,
          away_id: awayId,
          home_score: game.home.score,
          away_score: game.away.score,
        });

        if (!result) {
          this.logger.warn('unable to insert gameday', { result, gameday });
        }
      }
    }

    return true;
  }
  */

  /**
   * Delete a task from the database.
   */
  async deleteTask(id: string): Promise<boolean> {
    const result = await this.query('DELETE FROM tasks WHERE id = $1', [id]);

    if (!result || result.rowCount !== 1) {
      this.logger.warn('unable to delete task', { result, id });
      return false;
    }
    return true;
  }
}

let db: Database | null = null;

/**
 * Return a singleton database instance.
 */
export function getDatabase() {
  if (db) {
    return db;
  }

  const env = environment(process.env, loggerSingleton);

  if (!env) {
    return null;
  }
  db = new Database(env.connectionString, loggerSingleton);
  db.open();

  return db;
}

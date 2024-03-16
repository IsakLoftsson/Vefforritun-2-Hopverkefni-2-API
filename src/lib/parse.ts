import { Task, TaskType } from '../types.js';
import { ILogger } from './logger.js';

/**
 * Parse a JSON string and try and get an array of team names as strings.
 * Throws if error happens.
 * @throws {Error} If unable to parse JSON.
 * @param data Potential team data.
 * @returns Array of team names, empty if no data.
 */
export function parseTaskTypesJson(data: string): Array<string> {
  // Explicitly set type to `unknown` instead of the implicit `any` from
  // JSON.parse. This is because we want to check the type of the parsed string.
  let taskTypesParsed;
  try {
    taskTypesParsed = JSON.parse(data);
  } catch (e) {
    throw new Error('unable to parse task-type data');
  }

  const taskType = [];

  // Since we don't know what the data is we need to jump through some hoops to
  // check that it's an array and that it contains strings.
  if (Array.isArray(taskTypesParsed)) {
    for (const taskType of taskTypesParsed) {
      if (typeof taskType === 'string') {
        taskType.push(taskType);
      }
    }
  } else {
    throw new Error('task-type data is not an array');
  }

  return taskType;
}

/**
 * Parse team data. Skips illegal data.
 * @param data Potential team data.
 * @param logger Logger instance.
 * @param taskTypes Array of team names.
 * @returns Team object.
 */
export function parseTaskType(
  data: unknown,
  logger: ILogger,
  taskTypes: Array<string> = [],
): TaskType | null {
  if (typeof data !== 'object' || !data) {
    // This is a bit annoying in our test output! How should we fix it?
    logger.warn('illegal task-type object', data);
    return null;
  }

  // More hoops to jump through to check that the data is what we expect.
  // First we need to check that the object has a `name` property and that it's
  // a string. Then we need to check that the name is in the task-types array.
  // If we have `js check` enabled and uncomment the first check, we'll get a
  // type error on the second check (`typoef data.name !== 'string'`) since we
  // don't know that `data` has a `name` property.
  if (
    !('name' in data) ||
    typeof data.name !== 'string' ||
    !taskTypes.includes(data.name)
  ) {
    logger.warn('illegal task-type data', data);
    return null;
  }

  return {
    name: data.name,
  };
}


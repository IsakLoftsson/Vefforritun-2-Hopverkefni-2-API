import { Request, Response } from 'express';
import { getDatabase } from '../lib/db.js';
import {
    createTaskValidationMiddleware,
    sanitizationMiddleware,
    validationCheck,
    xssSanitizationMiddleware,
} from '../lib/validation.js';

export async function listTasks(req: Request, res: Response) {
  const tasks = await getDatabase()?.getTasks();

  if (!tasks) {
    return res.status(500).json({ error: 'could not get tasks' });
  }

  return res.json(tasks);
}

export async function getTask(req: Request, res: Response) {
  const task = await getDatabase()?.getTask(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }

  return res.json(task);
}

export async function createTaskHandler(req: Request, res: Response) {
  const { name, description, date, task_type, task_tag, user_id } = req.body;

  const createdTask = await getDatabase()?.insertTask({
    name: name,
    description: description,
    date,
    task_type_id: task_type,
    task_tag_id: task_tag,
    user_id: user_id,
  });

  if (!createdTask) {
    return res.status(500).json({ error: 'could not create task' });
  }

  return res.status(201).json(createdTask);
}

export const createTask = [
  ...createTaskValidationMiddleware(),
  ...xssSanitizationMiddleware(),
  validationCheck,
  ...sanitizationMiddleware(),
  createTaskHandler,
];

export async function deleteTask(req: Request, res: Response) {
  const deletedTask = await getDatabase()?.deleteTask(req.params.id);

  if (!deletedTask) {
    return res.status(500).json({ error: 'could not delete task' });
  }

  return res.status(204).json({});
}
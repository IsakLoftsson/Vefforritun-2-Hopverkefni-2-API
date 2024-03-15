import { NextFunction, Request, Response } from 'express';

import slugify from 'slugify';
import { getDatabase } from '../lib/db.js';
import {
  atLeastOneBodyValueValidator,
  genericSanitizer,
  stringValidator,
  taskTypeDoesNotExistValidator,
  validationCheck,
  xssSanitizer,
} from '../lib/validation.js';

export async function listTaskTypes(req: Request, res: Response) {
  const task_types = await getDatabase()?.getTaskTypes();

  if (!task_types) {
    return res.status(500).json({ error: 'Could not get task types' });
  }

  return res.json(task_types);
}

export async function createTaskTypeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name } = req.body;

  const createdDeprtment = await getDatabase()?.insertTaskType(name);

  if (!createdDeprtment) {
    return next(new Error('unable to create department'));
  }

  return res.status(201).json(createdDeprtment);
}

export const createTaskType = [
  stringValidator({ field: 'name', maxLength: 64 }),
  stringValidator({
    field: 'description',
    valueRequired: false,
    maxLength: 1000,
  }),
  taskTypeDoesNotExistValidator,
  xssSanitizer('title'),
  xssSanitizer('description'),
  validationCheck,
  genericSanitizer('title'),
  genericSanitizer('description'),
  createTaskTypeHandler,
];

export async function getTaskType(req: Request, res: Response) {
  const task_type = await getDatabase()?.getTaskType(req.params.slug);

  if (!task_type) {
    return res.status(404).json({ error: 'Task Type not found' });
  }

  return res.json(task_type);
}

export async function updateTaskTypeHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { slug } = req.params;
  const task_type = await await getDatabase()?.getTaskType(slug);

  if (!task_type) {
    return next();
  }

  const { name, description } = req.body;

  const fields = [
    typeof name === 'string' && name ? 'name' : null,
    typeof name === 'string' && name ? 'slug' : null,
    typeof description === 'string' && description ? 'description' : null,
  ];

  const values = [
    typeof name === 'string' && name ? name : null,
    typeof name === 'string' && name ? slugify(name).toLowerCase() : null,
    typeof description === 'string' && description ? description : null,
  ];

  const updated = await getDatabase()?.conditionalUpdate(
    'task_types',
    task_type.id,
    fields,
    values,
  );

  if (!updated) {
    return next(new Error('unable to update task type'));
  }

  const updated_task_type = updated.rows[0];
  return res.json(updated_task_type);
}

export const updateTaskType = [
  stringValidator({ field: 'name', maxLength: 64, optional: true }),
  stringValidator({
    field: 'description',
    valueRequired: false,
    maxLength: 1000,
    optional: true,
  }),
  atLeastOneBodyValueValidator(['name', 'description']),
  xssSanitizer('name'),
  xssSanitizer('description'),
  validationCheck,
  updateTaskTypeHandler,
];


export async function deleteTaskType(req: Request, res: Response) {
  const deletedTaskType = await getDatabase()?.deleteTaskType(req.params.slug);

  if (!deletedTaskType) {
    return res.status(500).json({ error: 'Could not delete task type' });
  }

  return res.json(deletedTaskType);
}

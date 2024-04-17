import express, { Request, Response } from 'express';
import { createTask, deleteTask, getTask, listTasks } from './tasks.js';
import {
  createTaskType,
  deleteTaskType,
  getTaskType,
  listTaskTypes,
  updateTaskType,
} from './task-types.js';
import { deleteUser, listUsers, createUser } from '../lib/user.js';

import { requireAdmin, requireAuthentication } from '../auth/passport.js';

export const adminRouter = express.Router();

export async function index(req: Request, res: Response) {
  return res.json([
    {
      href: '/verkefni',
      methods: ['GET', 'POST'],
    },
    {
      href: '/verkefni/:slug',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
    {
      href: '/login',
      methods: ['POST'],
    },
    {
      href: '/flokkar',
      methods: ['GET', 'POST'],
    },
    {
      href: '/flokkar/:slug',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
    {
      href: '/users',
      methods: ['GET','POST'],
    },
    {
      href: '/users/:id',
      methods: ['DELETE'],
    },
  ]);
}

adminRouter.get('/admin', requireAdmin, index);

adminRouter.get('/verkefni', requireAuthentication, listTasks);
adminRouter.post('/verkefni', requireAuthentication, createTask);
adminRouter.get('/verkefni/:id', requireAuthentication, getTask);
adminRouter.patch('/verkefni/:id', requireAuthentication, updateTaskType);
adminRouter.delete('/verkefni/:id', requireAuthentication, deleteTask);

adminRouter.get('/flokkar', requireAuthentication, listTaskTypes);
adminRouter.post('/flokkar', requireAuthentication, createTaskType);
adminRouter.get('/flokkar/:slug', requireAuthentication, getTaskType);
adminRouter.patch('/flokkar/:slug', requireAuthentication, updateTaskType);
adminRouter.delete('/flokkar/:slug', requireAuthentication, deleteTaskType);

adminRouter.get('/users', requireAdmin, listUsers);
adminRouter.post('/users',  requireAdmin, createUser);
adminRouter.delete('/users/:id',  requireAdmin, deleteUser);
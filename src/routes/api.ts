import express, { Request, Response } from 'express';
import { createTask, deleteTask, getTask, listTasks } from './tasks.js';
import {
  createTaskType,
  deleteTaskType,
  getTaskType,
  listTaskTypes,
  updateTaskType,
} from './task-types.js';

export const router = express.Router();

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
      href: '/verkefni_klarud',
      methods: ['GET', 'POST'],
    },
    {
      href: '/verkefni_klarud/:slug',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
    {
      href: '/flokkar',
      methods: ['GET', 'POST'],
    },
    {
      href: '/flokkar/:slug',
      methods: ['GET', 'PATCH', 'DELETE'],
    },
  ]);
}

router.get('/', index);

router.get('/teams', listTaskTypes);
router.post('/teams', createTaskType);
router.get('/teams/:slug', getTaskType);
router.patch('/teams/:slug', updateTaskType);
router.delete('/teams/:slug', deleteTaskType);

router.get('/games', listTasks);
router.post('/games', createTask);
router.get('/games/:id', getTask);
router.delete('/games/:id', deleteTask);
// router.patch('/games/:id', updateTask);

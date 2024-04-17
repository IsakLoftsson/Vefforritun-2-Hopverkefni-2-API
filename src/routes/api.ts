import express, { Request, Response } from 'express';
import { getTask, listTasks } from './tasks.js';
import { getTaskType, listTaskTypes } from './task-types.js';

export const router = express.Router();

export async function index(req: Request, res: Response) {
  return res.json([
    {
      href: '/verkefni',
      methods: ['GET'],
    },
    {
      href: '/verkefni/:slug',
      methods: ['GET'],
    },
    {
      href: '/flokkar',
      methods: ['GET'],
    },
    {
      href: '/flokkar/:slug',
      methods: ['GET'],
    },
  ]);
}

router.get('/', index);

router.get('/verkefni', listTasks);
router.get('/verkefni/:id', getTask);

router.get('/flokkar', listTaskTypes);
router.get('/flokkar/:slug', getTaskType);
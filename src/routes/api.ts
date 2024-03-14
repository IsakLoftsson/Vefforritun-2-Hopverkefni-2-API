import express, { Request, Response } from 'express';
/* import { createGame, deleteGame, getGame, listGames } from './games.js';
import {
  createTeam,
  deleteTeam,
  getTeam,
  listTeams,
  updateTeam,
} from './teams.js'; */

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

/* router.get('/teams', listTeams);
router.post('/teams', createTeam);
router.get('/teams/:slug', getTeam);
router.patch('/teams/:slug', updateTeam);
router.delete('/teams/:slug', deleteTeam);

router.get('/games', listGames);
router.post('/games', createGame);
router.get('/games/:id', getGame);
router.delete('/games/:id', deleteGame); */
// router.patch('/games/:id', updateGame);

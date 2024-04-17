import express, {Request, Response } from 'express';
import { cors } from './lib/cors.js';
import { router } from './routes/api.js';
import { adminRouter } from './routes/admin.js';
import { apiRouter } from './auth/api.js';
import passport from './auth/passport.js';

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(cors);

app.use(router);
app.use(adminRouter);
app.use(apiRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

export function checkAuthenticated(req,res, next){
  if(req.isAuthenticated()){
    return next()
  }

  res.redirect('/login')
}

export function checkNotAuthenticated(req,res, next){
  if(req.isAuthenticated()){
    res.redirect('/')
  }
  next()
}


app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'not found' });
});


app.use((err: Error, req: Request, res: Response) => {
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    err.status === 400 &&
    'body' in err
  ) {
    return res.status(400).json({ error: 'invalid json' });
  }

  console.error('error handling route', err);
  return res
    .status(500)
    .json({ error: err.message ?? 'internal server error' });
});
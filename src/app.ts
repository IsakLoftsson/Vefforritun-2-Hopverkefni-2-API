import express from 'express';
import { cors } from './lib/cors.js';
import { router } from './routes/api.js';
import { adminRouter } from './routes/admin.js';

const app = express();

app.use(express.json());

app.use(cors);
app.use(router);
app.use(adminRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
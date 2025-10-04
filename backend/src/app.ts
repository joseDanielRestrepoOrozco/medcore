import express from 'express';
import './types/express';
import cors from 'cors';
import router from './routes/routes';
import unknownEndpoint from './middlewares/unknownEndpoint';
import errorHandler from './middlewares/errorHandler';
import { FRONTEND_ORIGIN } from './libs/config';

const app = express();

app.use(express.json());
const allowedOrigins = (FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use('/api/v1', router);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;

import express from 'express';
import './types/express';
import cors from 'cors';
import router from './routes/routes';
import unknownEndpoint from './middlewares/unknownEndpoint';
import errorHandler from './middlewares/errorHandler';
import path from 'path';

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/v1', router);


app.use(unknownEndpoint);
app.use(errorHandler);

export default app;

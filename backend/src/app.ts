import express from 'express';

import router from './routes/routes';
import unknownEndpoint from './middlewares/unknownEndpoint';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use('/api/v1', router);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;

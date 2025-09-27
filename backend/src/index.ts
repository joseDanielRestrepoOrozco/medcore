import app from './app';
import { PORT } from './libs/config';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import app from './app';
import { PORT } from './constant';

const server = app.listen(PORT, () => {
  console.log(`\t- Server Listening on ${PORT}`);
});

server.on('error', (err) => {
  console.log(err);
  process.exit();
});

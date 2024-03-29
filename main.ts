import { Server } from './src/server/server';

const server = new Server();

server
  .bootstrap()
  .then(server => {
    console.log('====================================');
    console.log(
      `Server it's running on port: ${server.application.address().port}`
    );
     console.log(
      `Server it's running on: ${server.application.address().port}`
    );
    console.log('====================================');
  })
  .catch(error => {
    console.log('====================================');
    console.log('Server failed to start...');
    console.log('====================================');
    console.error(error);
    process.exit(1);
  });

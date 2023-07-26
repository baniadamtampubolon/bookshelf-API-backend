const Hapi = require('@hapi/hapi');
const routes = require('./routes');
 
const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  server.route(routes);
 
  await server.start();
  console.log(`Proyek Bookshelf API sedang berjalan di server ${server.info.uri}`);
};
 
init();
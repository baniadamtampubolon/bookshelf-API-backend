const Hapi = require('@hapi/hapi'); // memanggil module @Hapi/hapi
const routes = require('./routes'); // memanggil module routes
 
const init = async () => {
  const server = Hapi.server({ // hapi server berjalan pada localhost:9000
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  server.route(routes); // server hapi terhubung dengan module routes
 
  await server.start();
  console.log(`Bookshelf API project running at server @ ${server.info.uri}`); // pesan status server
};
 
init();
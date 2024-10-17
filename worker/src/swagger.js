const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
      title: 'Serviço Worker',
      description: 'Documentação da API Backend do serviço Worker.\nPara o pleno funcionamento da API, é necessário um serviço de Broker rodando (RabbitMQ).'
    },
    host: 'localhost:3010',
    basePath: "/",
    schemes: ['http'],
    tags: [
        {
          "name": "consumer",
          "description": "Endpoints do consumidor"
        },
        {
          "name": "seller",
          "description": "Endpoints para o vendedor poder baixar os CSVs"
        },
    ],
  };
  
  const outputFile = '../swagger-output.json';
  const routes = ['./shared/routes/index.ts'];
  
  /* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */
  
  swaggerAutogen()(outputFile, routes, doc);
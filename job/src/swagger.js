const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
      title: 'Serviço Job',
      description: 'Documentação da API Backend do serviço Job.\nPara o pleno funcionamento da API, é necessário um serviço de Broker rodando (RabbitMQ).'
    },
    host: 'localhost:3000',
    basePath: "/",
    schemes: ['http'],
    tags: [
        {
          "name": "messager",
          "description": "Endpoints do mensageiro"
        },
    ],
    definitions: {
        TSeller: {
          $nome: 'Katie McDermott',
          $telefone: '406-471-8338',
          $id: 1
        },
        SingleMessage: {
          $seller: { $ref: '#/definitions/TSeller' },
          queue: 'Nome da fila do broker'
        }
    }
  };
  
  const outputFile = '../swagger-output.json';
  const routes = ['./shared/routes/index.ts'];
  
  /* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */
  
  swaggerAutogen()(outputFile, routes, doc);
const swaggerAutogen = require('swagger-autogen');
const { date } = require('zod');

const doc = {
    info: {
      title: 'Social Listener API GPT',
      description: 'Documentação da API Backend do Social Listener.\nPara utilizar as rotas, você precisa autenticar o usuário antes em user/login com o email e a senha \nIMPORTANTE: Todos os retornos são objetos de chave "response"'
    },
    host: 'localhost:3020',
    basePath: "/",
    schemes: ['http', 'https'],
    tags: [
        {
          "name": "user",
          "description": "Endpoints do usuário"
        },
        {
          "name": "social",
          "description": "Endpoints do sistema de social listening e geráação de relatórios"
        }
    ],
    securityDefinitions: {
        apiToken:{
            type: "apiKey",
            in: "header",       // can be "header", "query" or "cookie"
            name: "Authorization",  // name of the header, query parameter or cookie
            description: "Token de autorização da API"
        }
    },
    definitions: {
        CreateUser: {
          $email: 'john@doe.com',
          $permission: 'client ou admin',
          $status: true,
          $name: 'Nome do usuário',
          $password: 'senha',
          $chat_model: 'ID do assistente do GPT',
          $payload_file: 'Nome do arquivo payload do BuzzMonitor'
        },
        CreateOpponent: {
          name: 'Nome do concorrente',
          payload_file: 'Nome do arquivo payload do BuzzMonitor',
          user_id: 'ID do usuário associado'
        },
        CreateHistory: {
          date: 'Data daquele histórico',
          text: 'Texto',
          user_id: 'ID do usuário associado'
        },
        OpponentResponse: {
          id: 'ID do concorrente',
          name: 'Nome do concorrente',
          payload_file: 'Nome do arquivo payload do BuzzMonitor',
          user_id: 'ID do usuário associado'
        },
        HistoryResponse: {
          id: 'ID do histórico',
          date: 'Data daquele histórico',
          text: 'Texto',
          user_id: 'ID do usuário associado'
        },
        UserResponse: {
          id: 'ID do usuário',
          email: 'john@doe.com',
          permission: 'client ou admin',
          status: true,
          $name: 'Nome do usuário',
          $chat_model: 'ID do assistente do GPT',
          $payload_file: 'Nome do arquivo payload do BuzzMonitor',
          opponents: {
            $ref: '#/definitions/OpponentResponse'
          },
          history: {
            $ref: '#/definitions/HistoryResponse'
          }
        },
        UserResponseBasic: {
          id: 'ID do usuário',
          email: 'john@doe.com',
          permission: 'client ou admin',
          status: true,
          $name: 'Nome do usuário',
        }
    }
  };
  
  const outputFile = '../swagger-output.json';
  const routes = ['./shared/routes/index.ts'];
  
  /* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
  root file where the route starts, such as index.js, app.js, routes.js, etc ... */
  
  swaggerAutogen()(outputFile, routes, doc);
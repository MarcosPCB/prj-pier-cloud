---

# Serviço Worker - API Backend

Bem-vindo à API Backend do **Serviço Worker**! Esta API foi desenvolvida para facilitar a comunicação com um serviço de **Broker de mensageria** (RabbitMQ) e permitir o download de arquivos CSV de vendedores. A API possui dois principais grupos de funcionalidades - inscrição de consumidores em filas de mensageria e download de arquivos CSV de vendedores.

## Requisitos

Antes de utilizar a API, certifique-se de que os seguintes requisitos estejam atendidos.

- **RabbitMQ**: A API requer que o RabbitMQ esteja rodando para gerenciar as filas de mensagens.

  Você pode rodar o RabbitMQ utilizando o Docker com o seguinte comando:
  ```bash
  docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
  ```

- **Node.js**: A API foi desenvolvida com Node.js e requer o uso de Yarn para instalar as dependências e rodar o serviço.

## Instalação

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/MarcosPCB/prj-pier-cloud.git
   cd prj-pier-cloud/worker
   ```

2. Crie o arquivo `.env` baseado no `.env.example` fornecido:

   ```.env
    PORT= 3010
    API_CLIENT_URL= https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/clientes
    API_SALES_URL= https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/vendas
    API_PRODUCT_URL= https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/produtos
    API_BROKER_URL= amqp://localhost
    BROKER_QUEUE= sellerQueue
   ```

   Essas variáveis definem a **porta** onde o serviço será executado, a URL do **Broker de Mensageria**, as URLs das APIs de Vendas, Produtos e Clientes e o nome da fila padrão de Mensageria.

3. Instale as dependências do projeto:

   ```bash
   yarn install
   ```

4. Certifique-se de que o Broker de Mensageria (RabbitMQ) esteja rodando antes de iniciar os testes ou a aplicação.

5. Rode os testes:

   ```bash
   yarn test
   ```

   Se os testes rodarem sem falhas, a API está configurada corretamente.

6. Inicie a aplicação:

   ```bash
   yarn build && yarn start
   ```

   O serviço será iniciado por padrão na porta `3010`. Antes de iniciar, ele verificará se o Broker de Mensageria está rodando.

## Endpoints

A seguir estão os principais endpoints oferecidos pela API do **Serviço Worker**.

### 1. Inscrever Consumidor em Fila de Mensageria

**Endpoint**: `POST /consumer/subscribe`

Este endpoint permite inscrever um consumidor em uma fila específica do RabbitMQ. Conforme as mensagens forem distribuidas, a API automaticamente processará a mensagem, buscará os dados correspondentes nas APIs de Vendas, Produtos e Clientes, consolidando-os em uma relatório de vendas CSV que ficará salvo na pasta CSVs com a nomenclatura "relatorio_ID.csv" sendo ID a identificação do vendedor.

#### Requisição:

- **Parâmetros (Body)**: 
  - `queue` (string, opcional): Nome da fila no RabbitMQ. Exemplo: `"Nome da fila no Broker"`. Caso não seja enviado, ele utilizará o nome de file padrão no .env.
  - `tag` (string, opcional): Tag do consumidor que será utilizada. Exemplo: `"Nome da tag do consumidor"`. Caso não seja enviada, o Broker criará uma Tag aleatória.

Exemplo de corpo de requisição:
  ```json
  {
    "queue": "minha-fila",
    "tag": "consumidor-123"
  }
  ```

#### Respostas:

- **200 OK**: Consumidor foi inscrito com sucesso na fila.
  
  Exemplo de resposta:
  ```json
  {
    "consumerTag": "consumidor-123"
  }
  ```

- **500 Internal Server Error**: Ocorreu um erro no servidor ou não foi possível se conectar ao RabbitMQ.

---

### 2. Fazer Download de CSV de Vendedor

**Endpoint**: `GET /seller/download`

Este endpoint permite que você faça o download do arquivo CSV com as informações de um vendedor específico.

#### Requisição:

- **Parâmetros (Query)**:
  - `id` (string, obrigatório): O ID do vendedor cujos dados CSV você deseja baixar.

  Exemplo de requisição:
  ```
  GET /seller/download?id=1
  ```

#### Respostas:

- **200 OK**: O download do arquivo CSV foi iniciado.
- **404 Not Found**: O arquivo CSV requisitado não foi encontrado.
- **500 Internal Server Error**: Ocorreu um erro no servidor ou não foi possível fazer o download do arquivo.

---

## Como testar

Após a instalação e inicialização do serviço, você pode testar os endpoints usando ferramentas como **Postman** ou **cURL**.

Para testar o endpoint de inscrição de consumidores, você pode fazer a seguinte requisição:

```bash
curl -X POST http://localhost:3010/consumer/subscribe \
  -H "Content-Type: application/json" \
  -d '{"queue": "minha-fila", "tag": "consumidor-123"}'
```

E para testar o download de CSV de um vendedor:

```bash
curl -X GET 'http://localhost:3010/seller/download?id=123'
```

---

## Documentação Swagger

Para acessar a documentação completa e interativa da API, utilize o Swagger. Ele está disponível no endpoint:

- **Swagger URL**: `http://localhost:3010/api-docs`

---
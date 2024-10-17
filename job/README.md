---

# Documentação da API - Serviço Job

## Visão Geral

Bem-vindo à documentação da API do **Serviço Job**! Esta API foi desenvolvida para o envio de mensagens para um **broker de mensageria** (RabbitMQ) com informações de vendedores. A API fornece dois endpoints principais: um para o envio de várias mensagens e outro para o envio de uma única mensagem.

### Como funciona?

A API permite que você envie dados de vendedores para um serviço de mensageria, que por sua vez envia essas mensagens para uma outra API que consumirá esses dados. As informações do vendedor, como nome, telefone e ID, são provenientes de uma API externa ou são enviadas em formato JSON para serem colocadas na fila do broker.

Para que tudo funcione corretamente, você precisará garantir que o RabbitMQ esteja configurado e rodando no ambiente.

---

## Requisitos

- **RabbitMQ**: O serviço **Job** depende do RabbitMQ para envio das mensagens. Certifique-se de que o RabbitMQ esteja rodando e configurado adequadamente. Para fins de teste, utilize este Docker:
```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
```
- **Node.js**: A API foi desenvolvida com Node.js e requer o uso de Yarn para instalar as dependências e rodar o serviço.

---

## Instalação

1. Clone o repositório e entre na pasta do projeto:

   ```bash
   git clone https://github.com/MarcosPCB/prj-pier-cloud.git
   cd prj-pier-cloud/job
   ```

2. Crie o arquivo **.env** baseado no **.env.example**:

```.env
PORT= 3000
API_SELLER_URL= https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/vendedores
API_BROKER_URL= amqp://localhost
BROKER_QUEUE= sellerQueue
```

Esses dados referem-se à **porta** utilizada pela API, à URL da **API de vendedores**, à URL de acesso ao **Broker de Mensageria** e ao nome padrão da **fila do Broker**.

3. Instale as dependências do projeto:

   ```bash
   yarn
   ```

4. Certifique-se de que o Broker de Mensageria (RabbitMQ) esteja rodando antes de iniciar os testes ou a aplicação.

5. Rode os testes:

   ```bash
   yarn test
   ```

6. Inicie a aplicação:

   ```bash
   yarn build && yarn start
   ```

   O serviço será iniciado por padrão na porta `3000`. Antes de iniciar, ele verificará se o Broker de Mensageria está rodando.

---

## Endpoints

### 1. Gerar Mensagens em Massa

**Endpoint**: `POST /messager/generate`

Este endpoint permite que você envie um conjunto de mensagens para o broker RabbitMQ. Ele puxa as informações da API de vendedores e as envia direto para a fila de mensageria.

#### Requisição

- **Parâmetros (Body)**: Um objeto JSON contendo o nome da fila no broker onde as mensagens serão enviadas.
  - **queue** (string, opcional): Nome da fila no RabbitMQ (se estiver vazio, ele utilizará o nome no .env).

  Exemplo de Requisição:
  ```json
  {
    "queue": "vendedores-fila"
  }
  ```

#### Respostas

- **200 OK**: Confirma o envio das mensagens. A resposta indica quantas mensagens foram enviadas.
  - Exemplo: `"Sent X sellers to broker"`
- **500 Internal Server Error**: Ocorreu um erro no servidor ou não foi possível se conectar ao broker RabbitMQ.
- **502 Bad Gateway**: A API de vendedores respondeu com dados inválidos.

---

### 2. Gerar Mensagem Única

**Endpoint**: `POST /messager/message`

Use este endpoint quando você precisar enviar uma única mensagem pré-configurada para o broker.

#### Requisição

- **Parâmetro (Body)**: Um objeto JSON com os dados do vendedor e o nome da fila onde a mensagem será enviada.
  - **seller** (object, obrigatório): Contém os dados do vendedor que serão enviados. Inclui nome, telefone e ID.
  - **queue** (string, opcional): Nome da fila no RabbitMQ (se estiver vazio, ele utilizará o nome no .env).

  Exemplo de Requisição:
  ```json
  {
    "seller": {
      "nome": "Katie McDermott",
      "telefone": "406-471-8338",
      "id": 1
    },
    "queue": "vendedores-fila"
  }
  ```

#### Respostas

- **200 OK**: Mensagem enviada com sucesso.
  - Exemplo: `"success"`
- **400 Bad Request**: Algum parâmetro necessário está faltando na requisição.
- **500 Internal Server Error**: Ocorreu um erro no servidor ou não foi possível se conectar ao broker RabbitMQ.

---

## Exemplo de Uso

### Exemplo de Uso com Postman

1. Abra o Postman e crie uma nova requisição do tipo `POST`.
2. No campo de URL, insira:
   
   - Para gerar mensagens em massa: `http://localhost:3000/messager/generate`
   - Para gerar uma mensagem única: `http://localhost:3000/messager/message`
   
3. Na aba **Body**, selecione o formato **raw** e escolha **JSON**.

4. Para o endpoint `/messager/message`, insira o seguinte JSON no corpo da requisição:
   ```json
   {
     "seller": {
       "nome": "Katie McDermott",
       "telefone": "406-471-8338",
       "id": 1
     },
     "queue": "vendedores-fila"
   }
   ```

5. Clique em **Send** para enviar a requisição. A resposta da API deve ser:
   ```json
   "success"
   ```

### Exemplo de Uso com cURL

#### Gerar Mensagens em Massa

```bash
curl -X POST http://localhost:3000/messager/generate \
  -H "Content-Type: application/json" \
  -d '{"queue": "vendedores-fila"}'
```

#### Gerar Mensagem Única

```bash
curl -X POST http://localhost:3000/messager/message \
  -H "Content-Type: application/json" \
  -d '{
    "seller": {
      "nome": "Katie McDermott",
      "telefone": "406-471-8338",
      "id": 1
    },
    "queue": "vendedores-fila"
  }'
```

---

## Documentação Swagger

Para acessar a documentação completa e interativa da API, utilize o Swagger. Ele está disponível no endpoint:

- **Swagger URL**: `http://localhost:3010/api-docs`

---
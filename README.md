---

# Projeto Backend - Serviço de Mensageria e Processamento de Vendedores

Este projeto consiste em dois microserviços desenvolvidos para lidar com a comunicação de dados de vendedores via um **Broker de Mensageria** (RabbitMQ). Cada serviço desempenha um papel específico na arquitetura e foi projetado para ser modular, flexível e escalável.

## Visão Geral

Este projeto é dividido em dois serviços principais.
1. **Serviço Worker** - Responsável por receber e processar mensagens de consumidores e fornecer funcionalidades de download de arquivos CSV.
2. **Serviço Job** - Focado no envio de mensagens para o broker de mensageria contendo dados de vendedores, permitindo tanto o envio de mensagens individuais quanto em massa.

Ambos os serviços foram desenvolvidos utilizando **Node.js** e **RabbitMQ** para garantir uma integração eficiente de mensageria.

## Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

```bash
root/
│
├── job/
│   ├── README.md  # Documentação do Serviço Job
│   └── (arquivos do serviço Job)
│
├── worker/
│   ├── README.md  # Documentação do Serviço Worker
│   └── (arquivos do serviço Worker)
│
└── README.md      # Este arquivo (documentação do projeto geral)
```

### Serviço Worker

- O **Serviço Worker** é responsável por interagir com o RabbitMQ para consumir mensagens de filas e fornecer endpoints que permitam o download de arquivos CSV contendo informações de vendedores.
  
- **Principais funcionalidades**:
  - Inscrição de consumidores em filas de mensageria.
  - Download de arquivos CSV de vendedores.
  
- Para mais detalhes, consulte o [README do Worker](https://github.com/MarcosPCB/prj-pier-cloud/blob/dev/worker/README.md).

### Serviço Job

- O **Serviço Job** tem como objetivo o envio de dados de vendedores para o RabbitMQ. Ele pode enviar uma única mensagem de vendedor ou várias mensagens de uma vez (bulk).
  
- **Principais funcionalidades**:
  - Envio de mensagens em massa para o broker de mensageria.
  - Envio de uma única mensagem para o broker.
  
- Para mais detalhes, consulte o [README do Job](https://github.com/MarcosPCB/prj-pier-cloud/blob/dev/job/README.md).

### Arquitetura do Projeto

![image](https://github.com/MarcosPCB/prj-pier-cloud/blob/dev/architecture.png)

## Pré-requisitos

Certifique-se de que os seguintes requisitos estão atendidos antes de iniciar a aplicação:

1. **RabbitMQ**: O broker de mensageria RabbitMQ deve estar rodando para que ambos os serviços possam se comunicar corretamente. Caso precise rodá-lo localmente, utilize o seguinte comando Docker:
   
   ```bash
   docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
   ```

2. **Node.js e Yarn**: Ambos os serviços utilizam Node.js e Yarn para a instalação de dependências e execução.

## Como Executar o Projeto

Siga os passos abaixo para configurar e rodar os serviços:

### 1. Clone o Repositório

```bash
git clone https://github.com/MarcosPCB/prj-pier-cloud.git
cd prj-pier-cloud
```

### 2. Configure as Variáveis de Ambiente

Cada serviço possui um arquivo `.env.example`. Antes de rodar os serviços, crie os arquivos `.env` a partir dos exemplos fornecidos.

#### Exemplo de Variável `.env` (Serviço Job)

```bash
PORT=3000
API_SELLER_URL=https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/vendedores
API_BROKER_URL=amqp://localhost
BROKER_QUEUE=sellerQueue
```

#### Exemplo de Variável `.env` (Serviço Worker)

```bash
PORT=3010
API_CLIENT_URL=https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/clientes
API_SALES_URL=https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/vendas
API_PRODUCT_URL=https://66ec84422b6cf2b89c5eabf1.mockapi.io/piercloud/api/v1/produtos
API_BROKER_URL=amqp://localhost
BROKER_QUEUE=sellerQueue
```

### 3. Instale as Dependências

Dentro de cada serviço (`job/` e `worker/`), execute o seguinte comando:

```bash
yarn
```

### 4. Rode os Testes

Antes de iniciar os serviços, é recomendável rodar os testes para garantir que tudo está funcionando corretamente. Lembre-se de que o RabbitMQ deve estar rodando para que os testes passem com sucesso.

**OBS:** Rode cada teste individualmente com as APIs desligadas, para evitar conflitos.

```bash
yarn test
```

### 5. Inicie os Serviços

Agora, com o RabbitMQ rodando, você pode iniciar cada serviço individualmente. Entre na pasta de cada serviço e execute:

```bash
yarn build && yarn start
```

Os serviços serão iniciados nas seguintes portas por padrão:
- **Serviço Worker**: Porta `3010`
- **Serviço Job**: Porta `3000`

## Testando os Endpoints

Você pode testar os endpoints de cada serviço utilizando ferramentas como **Postman** ou **cURL**. Consulte os respectivos arquivos README de cada serviço para mais detalhes sobre os endpoints disponíveis.

## Documentação

Cada serviço possui sua própria documentação completa via **Swagger**. Após iniciar os serviços, a documentação estará disponível nos seguintes endpoints:

- **Serviço Worker Swagger**: `http://localhost:3010/api-docs`
- **Serviço Job Swagger**: `http://localhost:3000/api-docs`

## Considerações Finais

Este projeto foi desenvolvido para demonstrar a capacidade de integração com brokers de mensageria e processamento de dados em microserviços. Cada serviço é modular e foi projetado para ser facilmente escalável e integrável com outros sistemas.

Sinta-se à vontade para explorar o código, rodar os testes e interagir com a API utilizando as ferramentas sugeridas.

---
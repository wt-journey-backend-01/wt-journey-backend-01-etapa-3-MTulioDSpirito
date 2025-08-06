# Instruções de Uso

Este documento contém as instruções para configurar e executar a API.

## Pré-requisitos
- Docker
- Node.js e npm

## 1. Configurar o Ambiente

1.  **Variáveis de Ambiente:** Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis para a conexão com o banco de dados:

    ```
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=policia_db
    ```

2.  **Subir o Banco de Dados:** Use o Docker Compose para iniciar o container do PostgreSQL.

    ```bash
    docker-compose up -d
    ```

3.  **Instalar Dependências:** Instale os pacotes do Node.js.

    ```bash
    npm install
    ```

## 2. Configurar o Banco de Dados

1.  **Executar Migrations:** Crie as tabelas no banco de dados.

    ```bash
    npx knex migrate:latest
    ```

2.  **Executar Seeds:** Popule as tabelas com dados iniciais.

    ```bash
    npx knex seed:run
    ```

## 3. Iniciar a Aplicação

Inicie o servidor em modo de desenvolvimento (com auto-reload).

```bash
npm start
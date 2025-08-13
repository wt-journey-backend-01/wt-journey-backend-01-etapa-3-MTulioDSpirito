# Instruções para Migrar o Projeto para Knex com Docker e PostgreSQL

Este documento descreve o passo a passo para migrar seu projeto (que atualmente usa arrays em memória) para usar um banco de dados **PostgreSQL** com **Knex.js** e **Docker**.  
Siga cada etapa na ordem para garantir que a aplicação funcione corretamente.

---

## 1. Preparar o ambiente

### 1.1 Instalar dependências necessárias

No terminal, dentro da pasta do seu projeto:

```bash
npm install knex pg dotenv
knex → Query builder para bancos SQL

pg → Driver PostgreSQL para Node.js

dotenv → Carrega variáveis de ambiente

2. Criar o arquivo .env
Na raiz do projeto, crie um .env:

env
Copiar
Editar
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=investigacao_db
NODE_ENV=development
3. Criar o arquivo docker-compose.yml
yaml
Copiar
Editar
services:
  postgres:
    container_name: postgres-database
    image: postgres:17
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pg-data:/var/lib/postgresql/data

volumes:
  pg-data:
4. Criar knexfile.js
js
Copiar
Editar
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds' },
  },
  ci: {
    client: 'pg',
    connection: {
      host: 'postgres',
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds' },
  },
};
5. Criar db/db.js
js
Copiar
Editar
const knexConfig = require('../knexfile');
const knex = require('knex');

const nodeEnv = process.env.NODE_ENV || 'development';
const config = knexConfig[nodeEnv];

const db = knex(config);

module.exports = db;
6. Subir o container
bash
Copiar
Editar
docker compose up -d
Verificar:

bash
Copiar
Editar
docker ps
7. Criar migrations
bash
Copiar
Editar
npx knex migrate:make create_agentes_table
npx knex migrate:make create_casos_table
8. Implementar migrations
8.1 create_agentes_table
js
Copiar
Editar
exports.up = async function (knex) {
  await knex.schema.createTable('agentes', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.date('dataDeIncorporacao').notNullable();
    table.string('cargo').notNullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('agentes');
};
8.2 create_casos_table
js
Copiar
Editar
exports.up = async function (knex) {
  await knex.schema.createTable('casos', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.text('descricao').notNullable();
    table.enu('status', ['Em Aberto', 'Em Progresso', 'Resolvido']).notNullable();
    table
      .integer('agenteId')
      .unsigned()
      .references('id')
      .inTable('agentes')
      .onDelete('SET NULL');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('casos');
};
9. Executar migrations
bash
Copiar
Editar
npx knex migrate:latest
10. Criar seeds (opcional)
bash
Copiar
Editar
npx knex seed:make initial_agentes
npx knex seed:make initial_casos
Exemplo db/seeds/initial_agentes.js:

js
Copiar
Editar
exports.seed = async function (knex) {
  await knex('agentes').del();
  await knex('agentes').insert([
    { nome: 'Carlos Silva', dataDeIncorporacao: '2020-03-15', cargo: 'Investigador' },
    { nome: 'Ana Souza', dataDeIncorporacao: '2019-08-01', cargo: 'Detetive' },
  ]);
};
Exemplo db/seeds/initial_casos.js:

js
Copiar
Editar
exports.seed = async function (knex) {
  await knex('casos').del();
  await knex('casos').insert([
    { titulo: 'Roubo no Centro', descricao: 'Roubo a uma joalheria no centro da cidade.', status: 'Em Aberto', agenteId: 1 },
    { titulo: 'Desaparecimento', descricao: 'Pessoa desaparecida há 2 semanas.', status: 'Em Progresso', agenteId: 2 },
  ]);
};
11. Executar seeds
bash
Copiar
Editar
npx knex seed:run
12. Ajustar repositórios
Exemplo repositories/agentesRepository.js:

js
Copiar
Editar
const db = require('../db/db');
const { AppError } = require('../utils/errorHandler');

async function findAll() {
  return await db('agentes').select('*').orderBy('id', 'asc');
}

async function findById(id) {
  return await db('agentes').where({ id }).first();
}

async function create(data) {
  const [agente] = await db('agentes').insert(data).returning('*');
  return agente;
}

async function update(id, data) {
  const [agente] = await db('agentes').update(data).where({ id }).returning('*');
  return agente || null;
}

async function remove(id) {
  return (await db('agentes').where({ id }).del()) > 0;
}

module.exports = { findAll, findById, create, update, remove };
13. Ajustar controllers
js
Copiar
Editar
const repository = require('../repositories/agentesRepository');

async function getAgentes(req, res, next) {
  try {
    const agentes = await repository.findAll();
    res.status(200).json(agentes);
  } catch (error) {
    next(error);
  }
}

async function createAgente(req, res, next) {
  try {
    const agente = await repository.create(req.body);
    res.status(201).json(agente);
  } catch (error) {
    next(error);
  }
}

module.exports = { getAgentes, createAgente };
14. Testar a API
Use Insomnia ou Postman para testar as rotas.

Para visualizar o banco, pode usar pgAdmin, DBeaver ou terminal.
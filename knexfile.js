require('dotenv').config();

// Determina se a aplicação está rodando em um container Docker
const isDocker = process.env.IS_DOCKER === 'true';

module.exports = {
  development: {
    client: 'pg',
    connection: isDocker
      ? {
        // Configuração para rodar dentro do Docker Compose
        host: 'postgres',
        port: 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
      }
      : {
        // Configuração para rodar localmente (fora do Docker)
        host: '127.0.0.1',
        port: 5442,
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
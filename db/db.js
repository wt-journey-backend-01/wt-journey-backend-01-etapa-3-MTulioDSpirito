const knex = require('knex');
const config = require('../knexfile');
const { snakeCase, camelCase } = require('lodash');

// Função para converter chaves do objeto para camelCase
const convertKeysToCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }
  
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      camelCase(key),
      typeof value === 'object' ? convertKeysToCamelCase(value) : value
    ])
  );
};

// Configuração do Knex com conversão automática
const dbConfig = {
  ...config.development,
  postProcessResponse: (result) => convertKeysToCamelCase(result),
  wrapIdentifier: (value, origImpl) => origImpl(snakeCase(value))
};

const db = knex(dbConfig);

module.exports = db;
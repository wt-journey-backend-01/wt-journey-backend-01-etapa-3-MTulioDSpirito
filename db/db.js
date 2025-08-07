// db/db.js
const knex = require('knex');
const config = require('../knexfile');
const { snakeCase, camelCase } = require('lodash');

// Configuração para converter automaticamente entre camelCase e snake_case
const caseConverterConfig = {
  postProcessResponse: (result) => {
    if (Array.isArray(result)) {
      return result.map(row => convertKeysToCamelCase(row));
    }
    return convertKeysToCamelCase(result);
  },
  wrapIdentifier: (value, origImpl) => {
    return origImpl(snakeCase(value));
  }
};

// Função auxiliar para converter chaves do objeto para camelCase
const convertKeysToCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      camelCase(key),
      Array.isArray(value) 
        ? value.map(convertKeysToCamelCase) 
        : (typeof value === 'object' ? convertKeysToCamelCase(value) : value)
    ])
  );
};

// Criar instância do Knex com conversão de casos
const db = knex({
  ...config.development,
  ...caseConverterConfig
});

module.exports = db;
require('dotenv').config();
const { url } = require('node:inspector');
const { resolve } = require('node:path');
const modelsPath = resolve('src', 'app', 'models');
const migrationsPath = resolve('src', 'database', 'migrations');

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
  },
  
  'models-path': modelsPath,
  'migrations-path': migrationsPath,
};
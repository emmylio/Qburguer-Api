// config/config.cjs
const { resolve } = require('node:path');

// Caminhos para as pastas de models e migrations
const modelsPath = resolve('src', 'app', 'models');
const migrationsPath = resolve('src', 'database', 'migrations');

module.exports = {
  // Configuração do ambiente de desenvolvimento
  development: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'qburguer',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
  },
  
  // Caminhos que o Sequelize CLI vai usar
  'models-path': modelsPath,
  'migrations-path': migrationsPath,
};
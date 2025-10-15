export default {
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
};
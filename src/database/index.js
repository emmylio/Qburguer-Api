import Sequelize from 'sequelize';
import configDatabase from '../config/database.js';
import mongoose from 'mongoose';

// Importe todos os seus models
import User from '../app/models/User.js';
import Product from '../app/models/Product.js';
import Address from '../app/models/Address.js';
import Order from '../app/models/Order.js';
import OrderItem from '../app/models/OrderItem.js';
import Category from '../app/models/Category.js';

const models = [User, Product, Address, Order, OrderItem, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
    this.associate(); // Garantimos que a associação é chamada após a inicialização
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.forEach((model) => model.init(this.connection));
  }

  mongo() {
    this.mongooseConnection = mongoose.connect('mongodb://localhost:27017/qburguer')
  }
  mongo() {
    this.mongooseConnection = mongoose.connect('mongodb://localhost:27017/qburguer')
      .then(() => {
        console.log('MongoDB connected successfully! ');
      })
      .catch((error) => {
        console.error('MongoDB connection error: ', error);
      });
  }

  // Este método agora contém TODA a lógica de relacionamento
  associate() {
    // Relacionamento User <-> Address
    User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
    Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    // Relacionamento User <-> Order
    User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
    Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

    // Relacionamento Address <-> Order
    Address.hasMany(Order, { foreignKey: 'address_id', as: 'orders' });
    Order.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });

    // Relacionamento Product <-> Category
    Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
    Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

    // Relacionamento Order <-> Product (Muitos-para-Muitos)
    Order.belongsToMany(Product, {
      through: OrderItem,
      foreignKey: 'order_id',
      as: 'products',
    });
    Product.belongsToMany(Order, {
      through: OrderItem,
      foreignKey: 'product_id',
      as: 'orders',
    });
  }
}

export default new Database();
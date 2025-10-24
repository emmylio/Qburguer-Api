import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.DECIMAL(10, 2),
        path: Sequelize.STRING,
        offer: Sequelize.BOOLEAN,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3002/product-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'products',
      },
    );

    return this;
  }

}

export default Product;
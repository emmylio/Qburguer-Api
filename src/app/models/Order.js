import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        total: Sequelize.DECIMAL(10, 2),
        status: Sequelize.ENUM(
          'pending',
          'preparing',
          'out_for_delivery',
          'delivered',
          'cancelled'
        ),
      },
      {
        sequelize,
      }
    );

    return this;
  }

  
  
}

export default Order;
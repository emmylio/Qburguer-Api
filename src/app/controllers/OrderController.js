// src/app/controllers/OrderController.js

import { v4 } from 'uuid';
import * as Yup from 'yup';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import OrderItem from '../models/OrderItem.js'; // Importante: Importar o OrderItem

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      addressId: Yup.string().uuid().required(),
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.string().uuid().required(),
            quantity: Yup.number().required().integer().positive(),
          })
        ),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { userId, addressId, products } = request.body;
    const productIds = products.map((p) => p.id);
    const foundProducts = await Product.findAll({ where: { id: productIds } });

    if (foundProducts.length !== productIds.length) {
        return response.status(404).json({ error: 'Um ou mais produtos não foram encontrados.' });
    }

    let total = 0;
    const orderItems = products.map((p) => {
      const productData = foundProducts.find((fp) => fp.id === p.id);
      total += productData.price * p.quantity;
      return {
        id: v4(),
        product_id: p.id,
        quantity: p.quantity,
        unit_price: productData.price,
      };
    });

    const order = await Order.create({
      id: v4(),
      user_id: userId,
      address_id: addressId,
      total,
      status: 'pending',
    });

    //  Salva os itens na tabela 'order_items'
    const itemsToCreate = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    await OrderItem.bulkCreate(itemsToCreate);

    return response.status(201).json({ message: 'Pedido realizado com sucesso!', orderId: order.id, total });
  }

  async index(request, response) {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        // Adicionado para também mostrar os produtos de cada pedido
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price', 'category'],
          through: { attributes: ['quantity', 'unit_price'] } // Mostra a quantidade e o preço daquele item no pedido
        }
      ],
    });

    return response.json(orders);
  }
}

export default new OrderController();
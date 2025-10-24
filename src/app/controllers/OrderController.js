import * as Yup from 'yup';
// IMPORT DO MONGOOSE
import Order from '../schemas/Order.js';

// IMPORTS DO SEQUELIZE (APENAS PARA LEITURA)
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
      .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false, strict: true });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // 1. Pegar IDs dos produtos do corpo da requisição
    const { userId, userName } = request;
    const { products } = request.body;
    const productIds = products.map((p) => p.id);

    // 2. Buscar os produtos no Postgres (Sequelize) para pegar os dados atuais
    const foundProducts = await Product.findAll({
      where: { id: productIds },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    if (foundProducts.length !== productIds.length) {
      return response
        .status(404)
        .json({ error: 'Um ou mais produtos não foram encontrados.' });
    }

    // 3. Montar o "snapshot" do produto para o MongoDB
    const mapedProducts = foundProducts.map(product => {

      const quantity = products.find(p => p.id === product.id).quantity;
      const newProduct = {

        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        quantity,
        url: product.url,
    
      };
      return newProduct
    });

    // 4. Montar o objeto final do pedido
    const order = {
      user: {
        id: userId, 
        name: userName,
      },
      products: mapedProducts,
      status: 'Pedido realizado'
    };

    // 5. Salvar o pedido no MongoDB (Mongoose)
    try {
      const newOrder = await Order.create(order);
      return response.status(201).json(newOrder);
    } catch (error) {
      return response.status(500).json({ error: 'Failed to create order.' });
    }
  }


  async update(request, response){
    const schema = Yup.object({
      status: Yup.string().required()
    });

try {
      schema.validateSync(request.body, { abortEarly: false, strict: true });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { status } = request.body;
    const { id } = request.params;

     try {
      await Order.updateOne({ _id: id }, { status }); 
    } catch (error) {
      return response.status(400).json({ error: err.message });
    }

    return response.status(200).json({message: "Status update successfully"});
  }

   async index(_request, response) {
      const orders = await Order.find();

      return response.status(200).json(orders);
     
    }
}

export default new OrderController();

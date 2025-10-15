import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js'; 

class ProductController {
  
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, price, category_id } = request.body;
    const { filename: path } = request.file;

    const productExists = await Product.findOne({
      where: { name },
    });

    if (productExists) {
      return response.status(400).json({ error: 'Product already exists.' });
    }

    const product = await Product.create({
      name,
      price,
      category_id, // Salva o ID da categoria
      path,
    });

    return response.status(201).json(product);
  }

  // --- MÉTODO PARA LISTAR TODOS OS PRODUTOS ---
  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    return response.json(products);
  }
}

export default new ProductController();

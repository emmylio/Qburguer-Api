import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class ProductController {
  // --- MÉTODO PARA CRIAR ---
  async store(request, response) {
    // ... (seu código de store está bom, vamos mantê-lo)
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { filename: path } = request.file;
    const { name, price, category_id, offer } = request.body;

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
      offer,
    });

    return response.status(201).json(product);
  }

  // --- MÉTODO PARA ATUALIZAR ---
  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // Pega o ID da rota (ex: /products/5)
    const { id } = request.params;

    // Garante que o produto existe antes de tentar atualizar
    const product = await Product.findByPk(id);
    if (!product) {
      return response.status(404).json({ error: 'Product not found.' });
    }

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name, price, category_id, offer } = request.body;

    await product.update({
      name,
      price,
      category_id,
      path,
      offer,
    });

    return response.status(200).json({ message: 'Product updated successfully' });
  }

  // --- MÉTODO PARA LISTAR ---
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
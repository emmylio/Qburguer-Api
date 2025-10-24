import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name } = request.body;
    const { filename: path } = request.file; // Já peguei como 'path'

    const existingCategory = await Category.findOne({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return response.status(400).json({ error: 'Category already exists.' });
    }

    const newCategory = await Category.create({
      name,
      path, // Salva o path
    });

    return response.status(201).json(newCategory);
  }

  // --- MÉTODO PARA ATUALIZAR ---
  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(), // O nome é opcional na atualização
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { id } = request.params; // Pega o ID da rota

    // 1. Busca a categoria pelo ID
    const category = await Category.findByPk(id);
    if (!category) {
      return response.status(404).json({ error: 'Category not found.' });
    }

    // 2. Verifica se um novo arquivo foi enviado
    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name } = request.body;

    // 3. Atualiza os dados no banco
    await category.update({
      name,
      path,
    });

    return response.status(200).json({ message: 'Category updated successfully' });
  }
  // --- FIM DO MÉTODO DE ATUALIZAÇÃO ---

  async index(__request, response) {
    const categories = await Category.findAll();

    return response.json(categories);
  }
}

export default new CategoryController();
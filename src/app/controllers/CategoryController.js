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


const existingCategory = await Category.findOne({
  where: { name },
});

if(existingCategory) {
    return response.status(400).json({ error: 'Category already exists.' });
}

const newCategory = await Category.create({ 
  name ,
 });

return response.status(201).json(newCategory);
  }

  async index(__request, response) {
    const categories = await Category.findAll();

    return response.json(categories);
  }
}

export default new CategoryController();
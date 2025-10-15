import { v4 } from 'uuid';
import * as Yup from 'yup';
import Address from '../models/Address.js';

class AddressController {
  async store(request, response) {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      neighborhood: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zipCode: Yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }


    const { userId, street, number, complement, neighborhood, city, state, zipCode } = request.body;

    const address = await Address.create({
      id: v4(),
      user_id: userId,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zip_code: zipCode,
    });

    return response.status(201).json(address);
  }

  async index(request, response) {
    const { userId } = request.query;

    if (!userId) {
      return response.status(400).json({ error: 'User ID is required.' });
    }

    const addresses = await Address.findAll({
      where: { user_id: userId },
    });

    return response.json(addresses);
  }
}

export default new AddressController();
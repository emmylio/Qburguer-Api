import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User.js';
import authConfig from '../../config/auth.js';

class SessionController {
  async store(request, response) {
    console.log('PISTA 4: A requisição CHEGOU no SessionController.');
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });


    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch(err) {
      return response.status(400).json({ error: err.errors });
    }

    const { email, password } = request.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return response.status(401).json({ error: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return response.status(401).json({ error: 'Password does not match.' });
    }

    const { id, name, admin } = user;

    // 1. GERAMOS O TOKEN UMA ÚNICA VEZ, com todas as informações necessárias
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        admin: user.admin 
        },
        authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    },
  );

    // 2. RETORNAMOS os dados do utilizador e o token que acabámos de criar
    return response.json({
      user: {
        id,
        name,
        email,
        admin,
      },
      token, // 3. USAMOS A VARIÁVEL 'token' AQUI
    });
  }
}

export default new SessionController();
// src/app/middlewares/admin.js

export default async (request, response, next) => {
  // Ele lê a anotação feita pelo 'auth.js'
  const isAdmin = request.userIsAdmin;

  // Se 'isAdmin' for false (ou não existir), ele barra a entrada
  if (!isAdmin) {
    return response.status(401).json({ error: 'User is not an administrator.' });
  }

  // Se for 'true', ele deixa passar
  return next();
};
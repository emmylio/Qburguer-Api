import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.js';
import authMiddleware from './app/middlewares/auth.js';
import adminMiddleware from './app/middlewares/admin.js';

// Importe todos os seus controllers
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import OrderController from './app/controllers/OrderController.js';
import AddressController from './app/controllers/AddressController.js';
import CategoryController from './app/controllers/CategoryController.js';

const routes = new Router();
const upload = multer(multerConfig);

// ================== ROTAS PÚBLICAS ==================
// Estas não têm middleware e podem ser acedidas por qualquer um.
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/products', ProductController.index);
routes.get('/categories', CategoryController.index);

// ================== APLICA O "PORTEIRO" GLOBAL ==================
// Daqui para baixo, TODAS as rotas vão passar pelo middleware e exigir um token
routes.use(authMiddleware);

// ================== ROTAS PRIVADAS ==================

// --- ROTAS DE PRODUTO ---
// Exige que o utilizador esteja logado E que seja admin
routes.post('/products', adminMiddleware, upload.single('file'), ProductController.store);
routes.put('/products/:id', adminMiddleware, upload.single('file'), ProductController.update);


// --- ROTAS DE CATEGORIA ---
// Exige que o utilizador esteja logado E que seja admin
routes.post('/categories', adminMiddleware, upload.single('file'), CategoryController.store);

// NOVA ROTA PARA ATUALIZAR UMA CATEGORIA
routes.put('/categories/:id', adminMiddleware, upload.single('file'), CategoryController.update);


// --- ROTAS DE ENDEREÇO ---
// Exige apenas que o utilizador esteja logado
routes.post('/addresses', AddressController.store);
routes.get('/addresses', AddressController.index);

// --- ROTAS DE PEDIDO ---
// Exige apenas que o utilizador esteja logado
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', adminMiddleware, OrderController.update);

export default routes;
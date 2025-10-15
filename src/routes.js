import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.js';
import authMiddleware from './app/middlewares/auth.js';

// Importe todos os seus controllers
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import OrderController from './app/controllers/OrderController.js';
import AddressController from './app/controllers/AddressController.js';
import CategoryController from './app/controllers/CategoryController.js';
import adminMiddleware from './app/middlewares/admin.js';

const routes = new Router();
const upload = multer(multerConfig);

// ================== ROTAS PÚBLICAS ==================
// (Definidas ANTES do authMiddleware para não exigirem token)
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);


// ================== APLICA O "PORTEIRO" GLOBAL ==================
// Daqui para baixo, TODAS as rotas vão passar pelo middleware e exigir um token
routes.use(authMiddleware);


// ================== ROTAS PRIVADAS ==================
// (Agora todas estas rotas estão protegidas automaticamente)

// --- ROTAS DE PRODUTO ---
routes.post('/products', adminMiddleware, upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);


// --- ROTAS DE CATEGORIA ---
routes.post('/categories', adminMiddleware, CategoryController.store);
routes.get('/categories', CategoryController.index);


// --- ROTAS DE ENDEREÇO ---
routes.post('/addresses', AddressController.store);
routes.get('/addresses', AddressController.index);

// --- ROTAS DE PEDIDO ---
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);

export default routes;
import multer from 'multer';
import { v4 } from 'uuid';
import { extname, resolve, dirname } from 'node:path'; // Adicionado o 'dirname'
import { fileURLToPath } from 'node:url'; // Nova importação necessária

// Bloco de código para recriar o '__dirname' em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  storage: multer.diskStorage({
    // A lógica aqui continua a mesma, mas agora o '__dirname' existe e está correto
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) =>
      callback(null, v4() + extname(file.originalname)),
  }),
};
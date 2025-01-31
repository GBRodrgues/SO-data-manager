import express from 'express';
const router = express.Router();
import comandoController from '../controllers/comandoController.js';

router.post('/comando-bash', comandoController.executarComando);

export default router
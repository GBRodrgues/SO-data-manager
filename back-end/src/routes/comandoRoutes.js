import express from 'express';
import comandoController from '../controllers/comandoController.js';


const router = express.Router();


router.post('/comando-bash', comandoController.executarComando);
router.get('/comando-bash', comandoController.buscarCaminho);

export default router;
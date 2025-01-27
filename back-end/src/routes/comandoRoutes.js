const express = require('express');
const router = express.Router();
const comandoController = require('../controllers/comandoController');

router.post('/comando-bash', comandoController.executarComando);

module.exports = router;
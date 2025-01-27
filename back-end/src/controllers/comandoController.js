const comandoService = require('../services/comandoService');

const comandoController = {
    executarComando: (req, res) => {
        const { command, args } = req.body;

        if (!command) {
            return res.status(400).json({ success: false, message: 'Command is required' });
        }

        try {
            const result = comandoService.execute(command, args);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = comandoController;

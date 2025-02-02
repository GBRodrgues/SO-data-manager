import comandoService from '../services/comandoService.js';

const comandoController = {
    executarComando: (req, res) => {
        console.log('Requisição recebida no backend:', req.body);
        const { command, args } = req.body;

        if (!command) {
            console.log('Erro: Nenhum comando recebido.');
            return res.status(400).json({ success: false, message: 'Command is required' });
        }

        try {
            const result = comandoService.execute(command, args || {});
            console.log('Resultado da execução:', result);
            res.json(result);
        } catch (error) {
            console.error('Erro ao executar comando:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    buscarCaminho: (req, res) => {
        res.json(comandoService.printWorkingDirectory())
    }
};

export default comandoController;

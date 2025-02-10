import comandoService from '../services/comandoService.js';

const comandoController = {
    command_history: [],
    history_index: 0,
    executarComando: (req, res) => {
        console.log('Requisição recebida no backend:', req.body);
        const { command, args } = req.body;

        
        if (!command) {
            console.log('Erro: Nenhum comando recebido.');
            return res.status(400).json({ success: false, message: 'Command is required' });
        }
        if(command == 'arrow'){
            if(args.name == 'up'){
                if(comandoController.history_index <= comandoController.command_history.length){
                    comandoController.history_index += 1;
                    let indice = comandoController.command_history.length - comandoController.history_index;    
                    let last_command = (comandoController.command_history.at(indice));
                    console.log(last_command);
                    res.json({command: last_command})

                }
            }else{
                if(comandoController.history_index > 1){
                    comandoController.history_index -= 1;
                    let indice = comandoController.command_history.length - comandoController.history_index;    
                    let last_command = (comandoController.command_history.at(indice));
                    console.log(last_command);
                    res.json({command: last_command})
                }
            }
        }
        else{
            if(command == 'history'){
                var count = 0;
                let result = '';
                comandoController.command_history.forEach(comando => {
                    result = result + (count + ' - ' + comando)+ '\n';
                    count++;
                }); 
                console.log(result)
                res.json({success: true, message: result});
            }else{
                let comando_completo = (command + ' '+args.name);
                comandoController.command_history.push(comando_completo);
                

                try {
                    const result = comandoService.execute(command, args || {});
                    console.log('Resultado da execução:', result);
                    res.json(result);
                } catch (error) {
                    console.error('Erro ao executar comando:', error);
                    res.status(500).json({ success: false, message: error.message });
                }
            }
        }
    },

    buscarCaminho: (req, res) => {
        res.json(comandoService.getCamminho())
    }
};

export default comandoController;

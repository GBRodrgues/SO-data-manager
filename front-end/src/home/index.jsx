import { useState } from 'react';
import axios from 'axios';
import { 
  TerminalWrapper, 
  TerminalContainer, 
  TerminalOutput, 
  TerminalInputContainer, 
  TerminalPrompt, 
  TerminalInput 
} from './styles';



const Terminal = () => {
  const [output, setOutput] = useState('Bem-vindo SO-Corro Terminal!\n');
  const [command, setCommand] = useState('');
  const [path, setPath] = useState('root');
  const [comand_history] = useState([]);
  let [indice_comand_h, setIndice] = useState(1);
  
  const updatePath = async () => {
    try{
      const response = await axios.get('http://localhost:5174/api/comando-bash');
      setPath(response.data.message);
    }catch (error){
      console.log(error);
    }
  }


  const handleCommand = async (e) => {
  updatePath();
  console.log(e.key)
  if (e.key === 'Enter') {
    const trimmedCommand = command.trim();
    if (trimmedCommand) {
      console.log('Comando digitado:', trimmedCommand);
      comand_history.push(trimmedCommand)
      console.log(comand_history)
      // Separando o comando e o argumento
      const [commandName, ...argsArray] = trimmedCommand.split(' ');
      const args = { name: argsArray.join(' ') };  // Garantindo que o nome seja passado

      console.log('Estrutura da requisição:', { command: commandName, args });

      setOutput((prev) => `${prev}\nsudo:${path}$ ${trimmedCommand}`);
      
      try {
        const response = await axios.post('http://localhost:5174/api/comando-bash', {
          command: commandName,
          args: args  // Enviando args corretamente
        });

        console.log('Resposta do servidor:', response.data);

        if (response.data) {
          setOutput((prev) => `${prev}\n${response.data.message}`);
        } else {
          setOutput((prev) => `${prev}\nResposta inválida do servidor.`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        setOutput((prev) => `${prev}\nError: ${error.response?.data?.message || 'Falha na execução do comando.'}`);
      }
      setCommand('');
      updatePath();
      setIndice(1);
    }
  }
  if (e.key === 'ArrowUp' && indice_comand_h < comand_history.length) {
    setIndice(indice_comand_h += 1);
    setCommand(comand_history.at(comand_history.length -indice_comand_h));
  }
  if (e.key === 'ArrowDown'  && indice_comand_h > 0) {
    setIndice(indice_comand_h -= 1);
    setCommand(comand_history.at(comand_history.length -indice_comand_h));
  }
};

  return (
    <TerminalWrapper>
      <TerminalContainer>
        <TerminalOutput>{output}</TerminalOutput>
        <TerminalInputContainer>
          <TerminalPrompt
          onChange={updatePath}
          onLoad={updatePath}>{path}$ 
          </TerminalPrompt>
          <TerminalInput
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
          />
        </TerminalInputContainer>
      </TerminalContainer>
    </TerminalWrapper>
  );
};

export default Terminal;

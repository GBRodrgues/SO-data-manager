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
  const [path, setPath] = useState('/');
  
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
    }
  }
  if (e.key === 'ArrowUp') {
    try {
      const response = await axios.post('http://localhost:5174/api/comando-bash', {
        command: "arrow",
        args: {name: "up"}  // Enviando args corretamente
      });
      let last_command = response.data.command;
      setCommand(last_command);
    } catch(error){
      console.log(error)
    }
  }
  if (e.key === 'ArrowDown') {
    try {
      const response = await axios.post('http://localhost:5174/api/comando-bash', {
        command: 'arrow',
        args: {name: 'down'}  // Enviando args corretamente
      });
      let last_command = response.data.command;
      setCommand(last_command);
    } catch(error){
      console.log(error)
    }
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

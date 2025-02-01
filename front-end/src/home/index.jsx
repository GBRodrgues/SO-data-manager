import React, { useState } from 'react';
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

  const handleCommand = async (e) => {
  if (e.key === 'Enter') {
    const trimmedCommand = command.trim();
    if (trimmedCommand) {
      console.log('Comando digitado:', trimmedCommand);

      // Separando o comando e o argumento
      const [commandName, ...argsArray] = trimmedCommand.split(' ');
      const args = { name: argsArray.join(' ') };  // Garantindo que o nome seja passado

      console.log('Estrutura da requisição:', { command: commandName, args });

      setOutput((prev) => `${prev}\n$ ${trimmedCommand}`);
      
      try {
        const response = await axios.post('http://localhost:5174/api/comando-bash', {
          command: commandName,
          args: args  // Enviando args corretamente
        });

        console.log('Resposta do servidor:', response.data);

        if (response.data && response.data.message) {
          setOutput((prev) => `${prev}\n${response.data.message}`);
        } else {
          setOutput((prev) => `${prev}\nResposta inválida do servidor.`);
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        setOutput((prev) => `${prev}\nError: ${error.response?.data?.message || 'Falha na execução do comando.'}`);
      }

      setCommand('');
    }
  }
};

  return (
    <TerminalWrapper>
      <TerminalContainer>
        <TerminalOutput>{output}</TerminalOutput>
        <TerminalInputContainer>
          <TerminalPrompt>$</TerminalPrompt>
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

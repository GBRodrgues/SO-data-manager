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
        console.log('Enviando ao backend:', trimmedCommand);
        setOutput((prev) => `${prev}\n$ ${trimmedCommand}`);
        try {
          const response = await axios.post('http://localhost:3000/execute', {
            command: trimmedCommand,
          });
          setOutput((prev) => `${prev}\n${response.data.result || 'Comando executado com successo.'}`);
        } catch (error) {
          setOutput((prev) => `${prev}\nError: ${error.response?.data?.message || 'Falha na execução do comando.'}`);
        }
      }
      setCommand('');
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

import styled from "styled-components";
import codeGif from "../assets/matrix.gif";

export const TerminalWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  //background: url(${codeGif}) center/cover no-repeat;
  opacity: 0.9; /* Define a opacidade APENAS da imagem de fundo */
`;

export const TerminalContainer = styled.div`
  width: 90%;
  max-width: 800px;
  height: 80%;
  background-color: #2b2b2b;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const TerminalOutput = styled.div`
  flex: 1;
  padding: 10px;
  color: #00ff00;
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const TerminalInputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #1f1f1f;
`;

export const TerminalPrompt = styled.span`
  color: #00ff00;
  margin-right: 5px;
  font-family: "Courier New", Courier, monospace;
`;

export const TerminalInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #00ff00;
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
`;

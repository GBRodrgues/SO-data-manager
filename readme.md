# S.0. Data Manager

Sistema que simulará um Sistema Operacional, focando nas áreas de manipulação de repositórios e arquivos.
___

## Front End
Opções de frameworks para facilitar o desenvolvimento:
- [PyWebView](https://pywebview.flowrl.com/)
- [Dear PyGui](https://dearpygui.readthedocs.io/en/latest/)

___

## Back End
Estrutura de pastas
```
back-end/
│── src/                     # Código-fonte principal
│   ├── config/              # Configuração do servidor
│   │   ├── server.js        # Configuração e inicialização do Express
│   │
│   ├── controllers/         # Controladores das requisições HTTP
│   │   ├── comandoController.js  # Processa comandos e chama serviços
│   │
│   ├── models/              # Modelos para simular arquivos e diretórios
│   │   ├── Diretorio.js    # Simula diretórios e operações sobre eles
│   │   ├── Arquivo.js          # Simula arquivos e operações sobre eles
│   │
│   ├── services/            # Regras de negócio e lógica de execução
│   │   ├── comandoService.js  # Processa comandos e interage com models
│   │
│   ├── routes/              # Definição das rotas do Express
│   │   ├── comandoRoutes.js  # Rota para processar comandos
│
│── tests/                   # Testes unitários automatizados
│   ├── diretorio.test.js      # Testa manipulação de diretórios
│   ├── arquivo.test.js            # Testa manipulação de arquivos
│
│── package.json              # Configuração do projeto Node.js
│── jest.config.cjs           # Configuração do Jest para testes
│── index.js                  # Ponto de entrada do servidor
```
### Requisitos
 - Node JS
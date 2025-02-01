# S.0. Data Manager

Sistema que simulará um Sistema Operacional, focando nas áreas de manipulação de repositórios e arquivos.
___

## Front End

### Frameworks e Bibliotecas Utilizadas
React: Biblioteca principal para construção da interface de usuário.
Axios: Utilizado para fazer requisições HTTP para o backend.
Styled Components: Usado para criar componentes de estilo (CSS-in-JS), permitindo um design mais modular e reutilizável.
Estrutura do Frontend

```
front-end/
│── src/                     # Código-fonte principal
│   ├── components/          # Componentes React do sistema
│   │   ├── Terminal.jsx     # Componente de terminal interativo
│   │   ├── styles.js        # Estilos CSS em JavaScript
│   │
│   ├── App.jsx              # Componente principal que renderiza a aplicação
│   ├── index.js             # Ponto de entrada para a renderização da aplicação React
│   ├── service.js           # Serviço para se comunicar com o backend
│
│── public/                  # Arquivos públicos
│   ├── index.html           # Arquivo principal HTML da aplicação
│
│── package.json             # Configuração do projeto React
│── .env                     # Variáveis de ambiente (como URL do servidor)
```
### Configuração

Instalação das dependências: Após clonar o repositório, navegue até a pasta front-end e instale as dependências do React utilizando o comando:

```
npm install
```

Executando o Frontend: Após configurar as variáveis, inicie o servidor de desenvolvimento React com o comando:

```
npm run dev
```
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
###Configuração Backend

Instalar as dependências: Após clonar o repositório, navegue até a pasta back-end e instale as dependências necessárias executando:

```
npm install
```
Iniciar o servidor: Para iniciar o servidor backend, basta rodar o comando:
```
npm run dev
```
### Requisitos
 - Node JS

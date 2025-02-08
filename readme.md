# S.0. Data Manager

Sistema que simulará um Sistema Operacional, focando nas áreas de manipulação de repositórios e arquivos.

---

## Comandos a serem implementados:

#### Criação e Manipulação de Diretórios:

- [x] mkdir nome: Criar um novo diretório.
- [x] rmdir nome: Remover um diretório vazio.
- [x] tree: Mostrar a estrutura hierárquica de arquivos e diretórios.
- [x] rename nome_antigo novo_nome: Renomear um arquivo ou diretório

#### Criação e Manipulação de Arquivos:

- [x] touch nome: Criar um arquivo vazio.
- [x] echo texto > arquivo: Adicionar ou sobrescrever o conteúdo de um arquivo.
- [x] echo texto >> arquivo: Adicionar texto ao final do conteúdo existente de um arquivo.
- [x] cat arquivo: Mostrar o conteúdo de um arquivo.
- [x] rm nome: Remover um arquivo ou diretório (mesmo que não esteja vazio).
- [x] head arquivo n: Exibir as primeiras `n` linhas do arquivo.
- [x] tail arquivo n: Exibir as últimas `n` linhas do arquivo.
- [x] wc arquivo: Mostrar o número de linhas, palavras e caracteres de um arquivo

#### Navegação entre Diretórios:

- [x] cd nome: Navegar para um diretório específico.
- [x] cd ..: Voltar ao diretório anterior.
- [x] cd /: Ir para o diretório raiz.
- [x] pwd: Exibir o caminho completo do diretório atual.

#### Busca e Filtragem:

- [x] find diretorio -name nome: Procurar arquivos ou diretórios pelo nome em uma
      hierarquia.
- [x] grep termo arquivo: Procurar por uma palavra ou frase dentro de um arquivo.

#### Permissões e Propriedades (Simuladas):

- [ ] chmod permissao nome: Alterar permissões de um arquivo ou diretório (simular
      leitura, escrita e execução).
- [x] chown proprietario nome: Alterar o proprietário de um arquivo ou diretório.
- [ ] ls -l: Listar conteúdo do diretório com detalhes (nome, tipo, tamanho, permissões, etc.).

#### Informações sobre Arquivos e Diretórios:

- [x] stat nome: Exibir informações detalhadas de um arquivo ou diretório (tamanho, data
      de criação, última modificação, etc.).
- [ ] du diretorio: Exibir o tamanho do diretório em bytes

#### Operações Avançadas:

- [x] cp origem destino: Copiar arquivos ou diretórios.
- [ ] mv origem destino: Mover arquivos ou diretórios para outra localização.
- [x] diff arquivo1 arquivo2: Comparar dois arquivos e exibir as diferenças.
- [x] zip arquivo.zip itens: Compactar arquivos ou diretórios em um arquivo `.zip`
      (simulado).
- [x] unzip arquivo.zip: Descompactar um arquivo `.zip`

#### Extras:

- [x] history: Exibir os últimos comandos digitados.

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

---

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

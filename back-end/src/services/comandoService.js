import Diretorio from "../models/Diretorio.js";
import Arquivo from "../models/Arquivo.js";

const comandoService = {
  // Inicializando um diretório raiz para simular um sistema de arquivos
  root: Diretorio.setupRoot(),
  currentPath: "~",
  execute: (command, args) => {
    console.log(`[LOG] Executando comando: ${command}`, args);
    console.log(command + " " + args.name);

    switch (command) {
      case "mkdir":
        return comandoService.createDirectory(args.name);
      case "rmdir":
        return comandoService.removeDirectory(args.name);
      case "touch":
        return comandoService.createFile(args.name);
      case "ls":
        return comandoService.listContents();
      case "cd":
        return comandoService.changeDirectory(args.name);
      case "pwd":
        return comandoService.printWorkingDirectory();
      case "stat":
        return comandoService.getFileStats(args.name);
      case "cat":
        return comandoService.showFileContent(args.name);
      case "rm":
        return comandoService.remove(args.name);
      case "rename":
        return comandoService.rename(args.name);
      case "tree":
        return comandoService.showTree();
      case "head":
        return comandoService.head(args.name);
      case "tail":
        return comandoService.tail(args.name);
      case "wc":
        return comandoService.wc(args.name); // Novo comando wc
      case "echo":
        const input = args.name;
        if (input.includes(">>")) {
          return comandoService.appendToFile(input); // Append (adicionar ao final)
        } else if (input.includes(">")) {
          return comandoService.writeFile(input); // Sobrescrever
        } else {
          return {
            success: false,
            message:
              'Formato inválido. Use: echo "texto" > arquivo.txt ou echo "texto" >> arquivo.txt',
          };
        }
      default:
        return { success: false, message: "Comando inválido!" };
    }
  },

  createDirectory: (name) => {
    if (!name) {
      return { success: false, message: "Nome obrigatório." };
    }

    const dirExists = comandoService.findDirectory(name);
    if (dirExists) {
      return { success: false, message: `O diretório '${name}' já existe` };
    }

    const newDir = new Diretorio(name, comandoService.root);
    comandoService.root.addSubPasta(newDir);
    return {
      success: true,
      message: `Diretório '${name}' criado com sucesso.`,
    };
  },

  removeDirectory: (name) => {
    if (!name) {
      return { success: false, message: "Nome obrigatório." };
    }

    const dir = comandoService.findDirectory(name);
    if (!dir) {
      return { success: false, message: `Diretório '${name}' não existe.` };
    }

    comandoService.root.removeSubPasta(name);
    return { success: true, message: `Diretório '${name}' removido` };
  },

  createFile: (name) => {
    if (!name) {
      return { success: false, message: "Nome do arquivo obrigatório." };
    }

    const file = new Arquivo(name);
    comandoService.root.addArquivo(file);
    return { success: true, message: `Arquivo '${name}' criado` };
  },

  listContents: () => {
    const contents = comandoService.root.listContents();
    if (contents.arquivos.length == 0 && contents.subpastas.length == 0) {
      return { success: false, message: "Diretório vazio." };
    }
    var conteudos = [];
    conteudos = contents.arquivos.concat(contents.subpastas);
    return { success: true, message: conteudos.join("\n") };
  },

  changeDirectory: (path) => {
    var pasta_atual = comandoService.root;

    if (path == "/" || path == "~") {
      //Se passar no cd algum desses dois caminho conhecido como rota raiz, tem que voltar até a inicial
      var raiz = false;
      while (!raiz) {
        if (pasta_atual.nome == "~") {
          raiz = true;
        } else {
          pasta_atual = pasta_atual.diretorioPai;
        }
      }
      comandoService.root = pasta_atual;
      return { success: true, message: "Retornamos a pasta raiz" };
    }

    var rota = path.split("/");

    rota.forEach((destino) => {
      console.log(destino);
      if (destino != ".") {
        //devemos continuar na mesma pasta, ou seja, não processar nada
        if (destino == "..") {
          // Devemos retornar a pasta pai
          if (pasta_atual.nome == "~") {
            //Se a pasta for a raiz
            return { success: false, message: "Você já está na pasta raiz." };
          }
          pasta_atual = pasta_atual.getDiretorioPai();
        } else {
          var diretorio = comandoService.findDirectory(destino); //procurando diretorio com o nome
          if (diretorio) {
            console.log(diretorio);
            pasta_atual = diretorio;
          } else {
            pasta_atual = null;
          }
        }
      }
      if (pasta_atual) {
        comandoService.root = pasta_atual; // se encontrar a pasta da repetição, muda o root para essa
      } else {
        return {
          success: false,
          message: `Não foi possível encontrar o diretório ${path}`,
        }; // se deparar com uma pasta vazia, cancela a busca
      }
    });
    //se tiver verificado todas as pastas do caminho, e tiver econtrado. Retorna succes
    if (comandoService.root) {
      return { success: true, message: `Diretório alterado para ${path}` };
    }
  },

  printWorkingDirectory: () => {
    return { success: true, message: comandoService.root.printWorkDirectory() };
  },

  getFileStats: (name) => {
    if (!name) {
      return { success: false, message: "Nome do arquivo obrigatório." };
    }

    const file = comandoService.root.arquivos.find((f) => f.nome === name);
    if (!file) {
      return { success: false, message: `Arquivo '${name}' não existe` };
    }
    const stats = file.getStats();
    return { success: true, stats };
  },

  findDirectory: (name) => {
    // Verifica se o diretório existe em subpastas do diretório atual
    return comandoService.root.subpastas.find((pasta) => pasta.nome === name);
  },

  findArquivo: (name) => {
    return comandoService.root.arquivos.find(
      (arquivo) => arquivo.nome === name
    );
  },

  showFileContent: (name) => {
    const arquivo = comandoService.findArquivo(name);
    if (!arquivo) {
      return { success: false, message: "Arquivo não existe." };
    }
    return { success: true, message: arquivo.read() };
  },

  remove: (name) => {
    const arquivo = comandoService.findArquivo(name);
    const subpasta = comandoService.findDirectory(name);

    console.log(arquivo);
    console.log(subpasta);

    if (!arquivo && !subpasta) {
      return {
        success: false,
        message: "Nenhum arquivo ou subasta encontrada com esse nome.",
      };
    }
    if (subpasta) {
      comandoService.root.removeSubPasta(name);
      return {
        success: true,
        message: `Pasta '${name}' removida com sucesso!`,
      };
    }
    comandoService.root.removeArquivo(name);
    return {
      success: true,
      message: `Arquivo '${name}' removido com sucesso!`,
    };
  },

  rename: (nomes) => {
    let vetor_nomes = nomes.split(" ");
    let nome_antigo = vetor_nomes[0];
    let nome_novo = vetor_nomes[1];
    console.log(nome_antigo);
    let arquivo = comandoService.findArquivo(nome_antigo);
    let dir = comandoService.findDirectory(nome_antigo);

    if (arquivo) {
      arquivo.updateNome(nome_novo);
      return {
        success: true,
        message: `Nome do arquivo alterado de "${nome_antigo}" para "${nome_novo}"`,
      };
    }
    if (dir) {
      dir.updateNome(nome_novo);
      return {
        success: true,
        message: `Nome do diretorio alterado de "${nome_antigo}" para "${nome_novo}"`,
      };
    }

    return {
      success: false,
      message: `Arquivo ou diretório "${nome_antigo}" não encontrado.`,
    };
  },
  showTree: () => {
    const buildTree = (dir, prefix = "") => {
      let result = "";
      const contents = dir.listContents();
      const totalItems = contents.subpastas.length + contents.arquivos.length;

      contents.subpastas.forEach((subpasta, index) => {
        const isLast =
          index === contents.subpastas.length - 1 &&
          contents.arquivos.length === 0;
        result += `${prefix}${isLast ? "└── " : "├── "}${subpasta.nome}\n`;
        result += buildTree(subpasta, `${prefix}${isLast ? "    " : "│   "}`);
      });

      contents.arquivos.forEach((arquivo, index) => {
        const isLast = index === contents.arquivos.length - 1;
        result += `${prefix}${isLast ? "└── " : "├── "}${arquivo.nome}\n`;
      });

      return result;
    };

    const treeStructure = buildTree(comandoService.root);
    return { success: true, message: treeStructure };
  },

  writeFile: (input) => {
    // Separar o texto e o nome do arquivo
    const [texto, arquivoNome] = input.split(">").map((item) => item.trim());

    if (!arquivoNome) {
      return { success: false, message: "Nome do arquivo é obrigatório." };
    }

    // Verificar se o arquivo já existe
    const arquivo = comandoService.findArquivo(arquivoNome);

    if (arquivo) {
      // Sobrescrever o conteúdo do arquivo
      arquivo.write(texto);
      return {
        success: true,
        message: `Conteúdo do arquivo '${arquivoNome}' sobrescrito.`,
      };
    } else {
      // Criar um novo arquivo com o conteúdo
      const novoArquivo = new Arquivo(arquivoNome);
      novoArquivo.write(texto);
      comandoService.root.addArquivo(novoArquivo);
      return {
        success: true,
        message: `Arquivo '${arquivoNome}' criado com o conteúdo.`,
      };
    }
  },
  appendToFile: (input) => {
    const splitIndex = input.indexOf(">>");
    if (splitIndex === -1) {
      return {
        success: false,
        message: 'Formato inválido. Use: echo "texto" >> arquivo.txt',
      };
    }

    const texto = input.slice(0, splitIndex).trim();
    const arquivoNome = input.slice(splitIndex + 2).trim();

    if (!arquivoNome) {
      return { success: false, message: "Nome do arquivo é obrigatório." };
    }

    const arquivo = comandoService.findArquivo(arquivoNome);

    if (arquivo) {
      arquivo.append(texto); // Adiciona o texto ao final do arquivo
      return {
        success: true,
        message: `Texto adicionado ao arquivo '${arquivoNome}'.`,
      };
    } else {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }
  },
  head: (input) => {
    // Divide o input no espaço para separar o nome do arquivo e o número de linhas
    const [arquivoNome, n] = input.split(" ").map((item) => item.trim());

    if (!arquivoNome || !n) {
      return {
        success: false,
        message: "Formato inválido. Use: head arquivo.txt n",
      };
    }

    const numLinhas = parseInt(n, 10);
    if (isNaN(numLinhas) || numLinhas <= 0) {
      return {
        success: false,
        message: "O número de linhas deve ser um valor positivo.",
      };
    }

    const arquivo = comandoService.findArquivo(arquivoNome);
    if (!arquivo) {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }

    // Divide o conteúdo do arquivo em linhas
    const linhas = arquivo.conteudo.split("\n");

    // Pega as primeiras n linhas
    const primeirasLinhas = linhas.slice(0, numLinhas).join("\n");

    return {
      success: true,
      message: `Primeiras ${numLinhas} linhas do arquivo '${arquivoNome}':\n${primeirasLinhas}`,
    };
  },

  tail: (input) => {
    // Divide o input no espaço para separar o nome do arquivo e o número de linhas
    const [arquivoNome, n] = input.split(" ").map((item) => item.trim());

    if (!arquivoNome || !n) {
      return {
        success: false,
        message: "Formato inválido. Use: tail arquivo.txt n",
      };
    }

    const numLinhas = parseInt(n, 10);
    if (isNaN(numLinhas) || numLinhas <= 0) {
      return {
        success: false,
        message: "O número de linhas deve ser um valor positivo.",
      };
    }

    const arquivo = comandoService.findArquivo(arquivoNome);
    if (!arquivo) {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }

    // Divide o conteúdo do arquivo em linhas
    const linhas = arquivo.conteudo.split("\n");

    // Pega as últimas n linhas
    const ultimasLinhas = linhas.slice(-numLinhas).join("\n");

    return {
      success: true,
      message: `Últimas ${numLinhas} linhas do arquivo '${arquivoNome}':\n${ultimasLinhas}`,
    };
  },
  wc: (arquivoNome) => {
    if (!arquivoNome) {
      return { success: false, message: "Nome do arquivo é obrigatório." };
    }

    const arquivo = comandoService.findArquivo(arquivoNome);
    if (!arquivo) {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }

    const conteudo = arquivo.conteudo;

    // Contar o número de linhas
    const numLinhas = conteudo.split("\n").length;

    // Contar o número de palavras
    const numPalavras = conteudo
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Contar o número de caracteres
    const numCaracteres = conteudo.length;

    return {
      success: true,
      message: `Arquivo '${arquivoNome}':\nLinhas: ${numLinhas}\nPalavras: ${numPalavras}\nCaracteres: ${numCaracteres}`,
    };
  },
};

export default comandoService;

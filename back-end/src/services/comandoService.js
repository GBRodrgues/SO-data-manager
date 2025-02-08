import Diretorio from "../models/Diretorio.js";
import Arquivo from "../models/Arquivo.js";
import Usuario from "../models/Usuario.js";
import fs from "fs";
import path from "path";

const comandoService = {
  // Inicializando um diretório raiz para simular um sistema de arquivos
  root: Diretorio.setupRoot(),
  currentPath: "~",
  execute: (command, args) => {
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
      case "adduser":
        return comandoService.adduser(args.name);
      case "save":
        return comandoService.save();
      case "find":
        return comandoService.find(args.name);
      case "grep":
        return comandoService.grep(args.name);
      case "cp":
        return comandoService.cp(args.name);
      case "mv":
        return comandoService.mv(args.name); // Novo comando mv
      case "adduser":
        return comandoService.adduser(args.name);
      case "save":
        return comandoService.save();
      case "chown":
        return comandoService.getuser(args.name);
      case "diff":
        return comandoService.diff(args.name);
      case "zip":
        return comandoService.zip(args.name);
      case "unzip":
        return comandoService.unzip(args.name);
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
            pasta_atual = diretorio;
          } else {
            pasta_atual = null;
            return null;
          }
        }
      }
      if (pasta_atual) {
        comandoService.root = pasta_atual; // se encontrar a pasta da repetição, muda o root para essa
      } else {
        return null;
      }
    });
    //se tiver verificado todas as pastas do caminho, e tiver econtrado. Retorna succes
    if (pasta_atual != null) {
      return { success: true, message: `Diretório alterado para ${path}` };
    } else {
      return { success: false, message: `Diretório ${path} não encontrado` };
    }
  },

  printWorkingDirectory: () => {
    return { success: true, message: comandoService.root.printWorkDirectory() };
  },

  getFileStats: (name) => {
    if (!name) {
      return {
        success: false,
        message: "Nome do arquivo/diretorio obrigatório.",
      };
    }

    const file = comandoService.root.arquivos.find((f) => f.nome === name);
    if (file) {
      return { success: true, message: file.getStats() };
    }

    const dir = comandoService.root.subpastas.find((f) => f.nome === name);
    if (dir) {
      return { success: true, message: dir.getStats() };
    }
    return {
      success: true,
      message: `Arquivo ou diretorio ${name} não encontrado`,
    };
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
    var root = comandoService.root.get_root();
    //incializa a resposta com o nome da pasta raiz
    let result = root.nome;

    const printTree = (dir, prefix = "", string_final) => {
      //funcao para criar arvore
      const subpastas = dir.subpastas;
      const arquivos = dir.arquivos;
      const total = subpastas.length + arquivos.length;

      subpastas.forEach((pasta, index) => {
        //para cada pasta do diretorio
        const isLast = index === total - 1; //se o indice for o último da pasta
        string_final = string_final.concat(
          prefix + (isLast ? "└── " : "├── ") + pasta.nome + "\n"
        ); //exibe o nome da subpasta
        string_final = printTree(
          pasta,
          prefix + (isLast ? "    " : "│   "),
          string_final
        ); //recursivamente, exibe o conteudo da subpasta
      });

      arquivos.forEach((arquivo, index) => {
        const isLast = index === arquivos.length - 1; //verifica se é o último arquivo da pasta
        string_final = string_final.concat(
          prefix + (isLast ? "└── " : "├── ") + arquivo.nome + "\n"
        ); //exibe o arquivo
      });
      return string_final;
    };

    result = printTree(root, "", result + "\n");
    return { success: true, message: result };
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

  //adicionando um novo usuário na pasta usr
  adduser: (username) => {
    const pastaUsuarios = comandoService.root
      .get_root()
      .subpastas.find((pasta) => pasta.nome === "usuarios");
    const n_usuarios = pastaUsuarios.subpastas.length;
    const usuario = new Usuario(username, n_usuarios + 1);

    const subpasta_usuario = usuario.getPastaUsuario(pastaUsuarios);
    const arquivo_usuario = new Arquivo(
      subpasta_usuario.nome + ".txt",
      usuario.getInfo()
    );
    subpasta_usuario.addArquivo(arquivo_usuario);
    pastaUsuarios.addSubPasta(subpasta_usuario);
    console.log(pastaUsuarios);
    console.log(usuario);
    return { success: true, message: "usuario criado com sucesso" };
  },

  save: () => {
    let caminhoBase = "./sistema_arquivos";
    if (!fs.existsSync(caminhoBase)) {
      fs.mkdirSync(caminhoBase, { recursive: true });
    }

    function criarDiretorio(diretorio, caminhoAtual) {
      const caminhoDiretorio = path.join(caminhoAtual, diretorio.nome);

      if (!fs.existsSync(caminhoDiretorio)) {
        fs.mkdirSync(caminhoDiretorio, { recursive: true });
      }

      // Criar arquivos no diretório
      diretorio.arquivos.forEach((arquivo) => {
        const caminhoArquivo = path.join(caminhoDiretorio, arquivo.nome);
        fs.writeFileSync(caminhoArquivo, arquivo.conteudo);
      });

      // Criar subdiretórios recursivamente
      diretorio.subpastas.forEach((subpasta) => {
        criarDiretorio(subpasta, caminhoDiretorio);
      });
    }

    criarDiretorio(comandoService.root.get_root(), caminhoBase);

    return {
      success: true,
      message: "Arquivos salvos com sucesso localmente.",
    };
  },

  getuser: (args) => {
    let args_arr = args.split(" ");
    let dirname = args_arr.pop();
    let username = args_arr.join(" ");
    console.log(username);

    const pastaUsuarios = comandoService.root
      .get_root()
      .subpastas.find((pasta) => pasta.nome === "usuarios").subpastas;
    let userFound = false;
    var count = 0;
    let usr = null;
    while (!userFound) {
      if (pastaUsuarios.length <= count) {
        return { success: false, message: "Usuário não encontrado" };
      }
      let handle_usr = pastaUsuarios.at(count);
      let arq_usr = handle_usr.arquivos.find(
        (arquivo) => arquivo.nome === handle_usr.nome + ".txt"
      );
      let name_arr = arq_usr.conteudo.split("\n").at(0).split(" ");
      name_arr.shift();
      let nome_usr = name_arr.join(" ");
      let id_usr = arq_usr.conteudo.split("\n").at(1).split(" ").at(1);
      count++;
      userFound = true ? nome_usr == username : false;
      usr = new Usuario(nome_usr, id_usr);
      console.log(usr);
    }

    const dir = comandoService.findDirectory(dirname);
    if (dir instanceof Diretorio) {
      dir.mudarProprietario(usr);
      return {
        success: true,
        message: "Proprietário do diretório alterado com sucesso",
      };
    } else {
      const arq = comandoService.findArquivo(dirname);
      if (arq instanceof Arquivo) {
        arq.mudarProprietario(usr);
        return {
          success: true,
          message: "Proprietário do arquivo alterado com sucesso",
        };
      }
      return { success: false, message: "Diretorio ou arquivo não encontrado" };
    }
  },

  find: (input) => {
    // Divide o input para extrair o tipo de busca (diretório ou arquivo) e o nome
    const [tipo, nome] = input.split(" ").map((item) => item.trim());

    if (!tipo || !nome) {
      return {
        success: false,
        message:
          "Formato inválido. Use: find directory nome ou find arquivo nome",
      };
    }

    if (tipo === "dir") {
      const resultado = comandoService.findDir(comandoService.root, nome);
      if (resultado) {
        return {
          success: true,
          message: `Diretório encontrado: ${resultado.caminho}`,
        };
      } else {
        return {
          success: false,
          message: `Diretório '${nome}' não encontrado.`,
        };
      }
    } else if (tipo === "arq") {
      const resultado = comandoService.findArq(comandoService.root, nome);
      if (resultado) {
        return {
          success: true,
          message: `Arquivo encontrado: ${resultado.caminho}`,
        };
      } else {
        return { success: false, message: `Arquivo '${nome}' não encontrado.` };
      }
    } else {
      return {
        success: false,
        message:
          "Tipo de busca inválido. Use: find directory nome ou find arquivo nome",
      };
    }
  },

  findDir: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o diretório atual é o que estamos procurando
    if (diretorioAtual.nome === nome) {
      return { nome: diretorioAtual.nome, caminho };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findDir(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },

  findArq: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o arquivo está no diretório atual
    const arquivo = diretorioAtual.arquivos.find(
      (arquivo) => arquivo.nome === nome
    );
    if (arquivo) {
      return { nome: arquivo.nome, caminho: `${caminho}/${arquivo.nome}` };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findArq(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },
  grep: (input) => {
    // Divide o input para extrair o termo e o nome do arquivo
    const [termo, arquivoNome] = input.split(" ").map((item) => item.trim());

    if (!termo || !arquivoNome) {
      return {
        success: false,
        message: "Formato inválido. Use: grep termo arquivo",
      };
    }

    // Encontra o arquivo
    const arquivo = comandoService.findArq2(comandoService.root, arquivoNome);
    if (!arquivo) {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }

    // Lê o conteúdo do arquivo
    const conteudo = arquivo.conteudo;

    // Divide o conteúdo em linhas
    const linhas = conteudo.split("\n");

    // Filtra as linhas que contêm o termo
    const linhasEncontradas = linhas.filter((linha) => linha.includes(termo));

    if (linhasEncontradas.length === 0) {
      return {
        success: true,
        message: `Nenhuma linha encontrada com o termo '${termo}'.`,
      };
    } else {
      return {
        success: true,
        message: `Linhas encontradas:\n${linhasEncontradas.join("\n")}`,
      };
    }
  },

  findArq2: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o arquivo está no diretório atual
    const arquivo = diretorioAtual.arquivos.find(
      (arquivo) => arquivo.nome === nome
    );
    if (arquivo) {
      return {
        nome: arquivo.nome,
        caminho: `${caminho}/${arquivo.nome}`,
        conteudo: arquivo.conteudo,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findArq2(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },
  cp: (input) => {
    // Divide o input para extrair a origem e o destino
    const [origem, destino] = input.split(" ").map((item) => item.trim());

    if (!origem || !destino) {
      return {
        success: false,
        message: "Formato inválido. Use: cp origem destino",
      };
    }

    // Encontra o arquivo ou diretório de origem
    const arquivoOrigem = comandoService.findArq3(comandoService.root, origem);
    const diretorioOrigem = comandoService.findDir3(
      comandoService.root,
      origem
    );

    if (!arquivoOrigem && !diretorioOrigem) {
      return { success: false, message: `Origem '${origem}' não encontrada.` };
    }

    // Encontra o diretório de destino
    const diretorioDestino = comandoService.findDir3(
      comandoService.root,
      destino
    );
    if (!diretorioDestino) {
      return {
        success: false,
        message: `Destino '${destino}' não encontrado.`,
      };
    }

    // Copia o arquivo ou diretório
    if (arquivoOrigem) {
      const novoArquivo = new Arquivo(arquivoOrigem.nome);
      novoArquivo.conteudo = arquivoOrigem.conteudo;
      novoArquivo.permissoes = arquivoOrigem.permissoes;
      novoArquivo.proprietario = arquivoOrigem.proprietario;
      diretorioDestino.arquivos.push(novoArquivo);
      return {
        success: true,
        message: `Arquivo '${origem}' copiado para '${destino}'.`,
      };
    } else if (diretorioOrigem) {
      const novoDiretorio = new Diretorio(diretorioOrigem.nome);
      novoDiretorio.arquivos = [...diretorioOrigem.arquivos];
      novoDiretorio.subpastas = [...diretorioOrigem.subpastas];
      novoDiretorio.permissoes = diretorioOrigem.permissoes;
      novoDiretorio.proprietario = diretorioOrigem.proprietario;
      diretorioDestino.subpastas.push(novoDiretorio);
      return {
        success: true,
        message: `Diretório '${origem}' copiado para '${destino}'.`,
      };
    }
  },

  findArq3: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o arquivo está no diretório atual
    const arquivo = diretorioAtual.arquivos.find(
      (arquivo) => arquivo.nome === nome
    );
    if (arquivo) {
      return {
        nome: arquivo.nome,
        caminho: `${caminho}/${arquivo.nome}`,
        conteudo: arquivo.conteudo,
        permissoes: arquivo.permissoes,
        proprietario: arquivo.proprietario,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findArq3(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },

  findDir3: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o diretório atual é o que estamos procurando
    if (diretorioAtual.nome === nome) {
      return {
        nome: diretorioAtual.nome,
        caminho,
        permissoes: diretorioAtual.permissoes,
        proprietario: diretorioAtual.proprietario,
        arquivos: diretorioAtual.arquivos,
        subpastas: diretorioAtual.subpastas,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findDir3(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },
  mv: (input) => {
    // Divide o input para extrair a origem e o destino
    const [origem, destino] = input.split(" ").map((item) => item.trim());

    if (!origem || !destino) {
      return {
        success: false,
        message: "Formato inválido. Use: mv origem destino",
      };
    }

    // Encontra o arquivo ou diretório de origem
    const arquivoOrigem = comandoService.findArq4(comandoService.root, origem);
    const diretorioOrigem = comandoService.findDir4(
      comandoService.root,
      origem
    );

    if (!arquivoOrigem && !diretorioOrigem) {
      return { success: false, message: `Origem '${origem}' não encontrada.` };
    }

    // Encontra o diretório de destino
    const diretorioDestino = comandoService.findDir4(
      comandoService.root,
      destino
    );
    if (!diretorioDestino) {
      return {
        success: false,
        message: `Destino '${destino}' não encontrado.`,
      };
    }

    // Move o arquivo ou diretório
    if (arquivoOrigem) {
      // Remove o arquivo da origem
      const diretorioOrigemArquivo = comandoService.findDir4(
        comandoService.root,
        origem.split("/").slice(0, -1).join("/")
      );
      diretorioOrigemArquivo.arquivos = diretorioOrigemArquivo.arquivos.filter(
        (arquivo) => arquivo.nome !== arquivoOrigem.nome
      );

      // Adiciona o arquivo ao destino
      diretorioDestino.arquivos.push(arquivoOrigem);
      return {
        success: true,
        message: `Arquivo '${origem}' movido para '${destino}'.`,
      };
    } else if (diretorioOrigem) {
      // Remove o diretório da origem
      const diretorioOrigemPai = comandoService.findDir4(
        comandoService.root,
        origem.split("/").slice(0, -1).join("/")
      );
      diretorioOrigemPai.subpastas = diretorioOrigemPai.subpastas.filter(
        (subdir) => subdir.nome !== diretorioOrigem.nome
      );

      // Adiciona o diretório ao destino
      diretorioDestino.subpastas.push(diretorioOrigem);
      return {
        success: true,
        message: `Diretório '${origem}' movido para '${destino}'.`,
      };
    }
  },

  findArq4: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o arquivo está no diretório atual
    const arquivo = diretorioAtual.arquivos.find(
      (arquivo) => arquivo.nome === nome
    );
    if (arquivo) {
      return {
        nome: arquivo.nome,
        caminho: `${caminho}/${arquivo.nome}`,
        conteudo: arquivo.conteudo,
        permissoes: arquivo.permissoes,
        proprietario: arquivo.proprietario,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findArq4(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },

  findDir4: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o diretório atual é o que estamos procurando
    if (diretorioAtual.nome === nome) {
      return {
        nome: diretorioAtual.nome,
        caminho,
        permissoes: diretorioAtual.permissoes,
        proprietario: diretorioAtual.proprietario,
        arquivos: diretorioAtual.arquivos,
        subpastas: diretorioAtual.subpastas,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findDir4(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },
  diff: (input) => {
    // Divide o input para extrair os nomes dos arquivos
    const [arquivo1, arquivo2] = input.split(" ").map((item) => item.trim());

    if (!arquivo1 || !arquivo2) {
      return {
        success: false,
        message: "Formato inválido. Use: diff arquivo1 arquivo2",
      };
    }

    // Encontra os arquivos
    const arquivo1Obj = comandoService.findArq5(comandoService.root, arquivo1);
    const arquivo2Obj = comandoService.findArq5(comandoService.root, arquivo2);

    if (!arquivo1Obj) {
      return {
        success: false,
        message: `Arquivo '${arquivo1}' não encontrado.`,
      };
    }
    if (!arquivo2Obj) {
      return {
        success: false,
        message: `Arquivo '${arquivo2}' não encontrado.`,
      };
    }

    // Compara o conteúdo dos arquivos
    const conteudo1 = arquivo1Obj.conteudo.split("\n");
    const conteudo2 = arquivo2Obj.conteudo.split("\n");

    const diff = comandoService.compararConteudo(conteudo1, conteudo2);

    if (diff.length === 0) {
      return { success: true, message: "Os arquivos são idênticos." };
    } else {
      return {
        success: true,
        message: `Diferenças encontradas:\n${diff.join("\n")}`,
      };
    }
  },

  compararConteudo: (conteudo1, conteudo2) => {
    const diff = [];
    const maxLines = Math.max(conteudo1.length, conteudo2.length);

    for (let i = 0; i < maxLines; i++) {
      const linha1 = conteudo1[i] || "";
      const linha2 = conteudo2[i] || "";

      if (linha1 !== linha2) {
        diff.push(`Linha ${i + 1}:\n< ${linha1}\n> ${linha2}`);
      }
    }

    return diff;
  },

  findArq5: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o arquivo está no diretório atual
    const arquivo = diretorioAtual.arquivos.find(
      (arquivo) => arquivo.nome === nome
    );
    if (arquivo) {
      return {
        nome: arquivo.nome,
        caminho: `${caminho}/${arquivo.nome}`,
        conteudo: arquivo.conteudo,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findArq5(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },
  zip: (input) => {
    // Divide o input para extrair o nome do arquivo .zip e os itens a serem compactados
    const [arquivoZip, ...itens] = input.split(" ").map((item) => item.trim());

    if (!arquivoZip || itens.length === 0) {
      return {
        success: false,
        message: "Formato inválido. Use: zip arquivo.zip item1 item2 ...",
      };
    }

    // Verifica se o arquivo .zip já existe
    if (comandoService.findArq6(comandoService.root, arquivoZip)) {
      return { success: false, message: `Arquivo '${arquivoZip}' já existe.` };
    }

    // Coleta os itens a serem compactados
    const itensCompactados = [];
    for (const item of itens) {
      const arquivo = comandoService.findArq6(comandoService.root, item);
      const diretorio = comandoService.findDir6(comandoService.root, item);

      if (!arquivo && !diretorio) {
        return { success: false, message: `Item '${item}' não encontrado.` };
      }

      if (arquivo) {
        itensCompactados.push({
          tipo: "arquivo",
          nome: arquivo.nome,
          conteudo: arquivo.conteudo,
        });
      } else if (diretorio) {
        itensCompactados.push({
          tipo: "diretorio",
          nome: diretorio.nome,
          itens: diretorio.arquivos.concat(diretorio.subpastas),
        });
      }
    }

    // Cria o arquivo .zip (simulado)
    const arquivoZipObj = new Arquivo(arquivoZip + ".zip");
    arquivoZipObj.conteudo = JSON.stringify(itensCompactados); // Simula a compactação
    comandoService.root.arquivos.push(arquivoZipObj);

    return {
      success: true,
      message: `Itens compactados em ${arquivoZip}.zip`,
    };
  },

  findArq6: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o arquivo está no diretório atual
    const arquivo = diretorioAtual.arquivos.find(
      (arquivo) => arquivo.nome === nome
    );
    if (arquivo) {
      return {
        nome: arquivo.nome,
        caminho: `${caminho}/${arquivo.nome}`,
        conteudo: arquivo.conteudo,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findArq6(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },

  findDir6: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o diretório atual é o que estamos procurando
    if (diretorioAtual.nome === nome) {
      return {
        nome: diretorioAtual.nome,
        caminho,
        arquivos: diretorioAtual.arquivos,
        subpastas: diretorioAtual.subpastas,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findDir6(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },
  unzip: (input) => {
    // Extrai o nome do arquivo .zip
    const arquivoZip = input.trim();

    if (!arquivoZip) {
      return {
        success: false,
        message: "Formato inválido. Use: unzip arquivo.zip",
      };
    }

    // Encontra o arquivo .zip
    const arquivoZipObj = comandoService.findArq7(
      comandoService.root,
      arquivoZip
    );
    if (!arquivoZipObj) {
      return {
        success: false,
        message: `Arquivo '${arquivoZip}' não encontrado.`,
      };
    }

    // "Descompacta" o arquivo .zip (simulado)
    try {
      const itensCompactados = JSON.parse(arquivoZipObj.conteudo);
      const mensagens = [];

      for (const item of itensCompactados) {
        let nomeFinal = item.nome;

        // Verifica se o item já existe no diretório atual
        if (
          comandoService.findArq7(comandoService.root, nomeFinal) ||
          comandoService.findDir7(comandoService.root, nomeFinal)
        ) {
          let contador = 1;
          while (
            comandoService.findArq7(
              comandoService.root,
              `${nomeFinal} Cópia(${contador})`
            ) ||
            comandoService.findDir7(
              comandoService.root,
              `${nomeFinal} Cópia(${contador})`
            )
          ) {
            contador++;
          }
          nomeFinal = `${nomeFinal} Cópia(${contador})`;
        }

        if (item.tipo === "arquivo") {
          const novoArquivo = new Arquivo(nomeFinal);
          novoArquivo.conteudo = item.conteudo;
          comandoService.root.arquivos.push(novoArquivo);
          mensagens.push(`Arquivo '${nomeFinal}' extraído.`);
        } else if (item.tipo === "diretorio") {
          const novoDiretorio = new Diretorio(nomeFinal);
          novoDiretorio.arquivos = item.itens.filter(
            (i) => i.tipo === "arquivo"
          );
          novoDiretorio.subpastas = item.itens.filter(
            (i) => i.tipo === "diretorio"
          );
          comandoService.root.subpastas.push(novoDiretorio);
          mensagens.push(`Diretório '${nomeFinal}' extraído.`);
        }
      }

      return {
        success: true,
        message: `Arquivo '${arquivoZip}' descompactado com sucesso:\n${mensagens.join(
          "\n"
        )}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao descompactar o arquivo '${arquivoZip}'.`,
      };
    }
  },

  findArq7: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o arquivo está no diretório atual
    const arquivo = diretorioAtual.arquivos.find(
      (arquivo) => arquivo.nome === nome
    );
    if (arquivo) {
      return {
        nome: arquivo.nome,
        caminho: `${caminho}/${arquivo.nome}`,
        conteudo: arquivo.conteudo,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findArq7(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },

  findDir7: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o diretório atual é o que estamos procurando
    if (diretorioAtual.nome === nome) {
      return {
        nome: diretorioAtual.nome,
        caminho,
        arquivos: diretorioAtual.arquivos,
        subpastas: diretorioAtual.subpastas,
      };
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = comandoService.findDir7(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },
  // getuser: (username) =>{
  //   const pastaUsuarios = comandoService.root.get_root().subpastas.find((pasta) => pasta.nome === 'usuarios');
  //   const pastaUsuarios = comandoService.root.get_root().subpastas.find((pasta) => pasta.nome === 'usuarios');
  // }
};

export default comandoService;

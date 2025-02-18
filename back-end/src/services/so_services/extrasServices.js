import Diretorio from "../../models/Diretorio.js";
import Usuario from "../../models/Usuario.js";
import Arquivo from "../../models/Arquivo.js";
import fs from "fs";
import path from "path";
import searchServices from "./searchServices.js";
import comandoService from "../comandoService.js";

const extraServices = {
  usuarioAtivo: null, // Variável privada para armazenar o usuário ativo

  // Função para definir o usuário ativo
  definirUsuarioAtivo: (usuario) => {
    extraServices.usuarioAtivo = usuario;
  },

  // Função para obter o usuário ativo
  obterUsuarioAtivo: () => {
    return extraServices.usuarioAtivo;
  },

  // Função para verificar se há um usuário ativo
  verificarUsuarioAtivo: () => {
    return extraServices.usuarioAtivo !== null;
  },
  listContents: (dir = Diretorio) => {
    const contents = dir.listContents();
    if (contents.arquivos.length == 0 && contents.subpastas.length == 0) {
      return { success: false, message: "Diretório vazio." };
    }
    var conteudos = [];
    conteudos = contents.arquivos.concat(contents.subpastas);
    return { success: true, message: conteudos.join("\n") };
  },

  listContentsDetailed: (dir = Diretorio) => {
    const contents = dir.listContents();
    const detailedList = [];

    // Adicionar detalhes das subpastas
    contents.subpastas.forEach((subpasta) => {
      detailedList.push({
        permissoes: "drwxr-xr-x", // Permissões padrão para diretórios
        tamanho: 4096, // Tamanho padrão de um diretório (em bytes)
        nome: subpasta,
      });
    });

    // Adicionar detalhes dos arquivos
    contents.arquivos.forEach((arquivoNome) => {
      // Buscar o arquivo pelo nome no diretório
      const arquivo = dir.arquivos.find((arq) => arq.nome === arquivoNome);

      if (arquivo) {
        detailedList.push({
          permissoes: "-rw-r--r--", // Permissões padrão para arquivos
          tamanho: arquivo.conteudo.length, // Tamanho baseado no conteúdo
          nome: arquivo.nome,
        });
      }
    });

    // Formatar a saída
    const formattedOutput = detailedList
      .map((item) => {
        // Alinhar a saída para melhor legibilidade
        const permissoes = item.permissoes.padEnd(10);
        const tamanho = String(item.tamanho).padStart(10);
        const nome = item.nome;
        return `${permissoes} ${tamanho} ${nome}`;
      })
      .join("\n");

    return { success: true, message: formattedOutput || "Diretório vazio." };
  },

  //adicionando um novo usuário na pasta usr
  adduser: (username, dir = Diretorio) => {
    // Verificar se a pasta "usuarios" existe
    const pastaUsuarios = dir
      .get_root()
      .subpastas.find((pasta) => pasta.nome === "usuarios");

    if (!pastaUsuarios) {
      return { success: false, message: "Pasta 'usuarios' não encontrada." };
    }

    // Verificar se o usuário já existe
    const usuarioExistente = pastaUsuarios.subpastas.find((subpasta) => {
      const arquivoUsuario = subpasta.arquivos.find(
        (arquivo) => arquivo.nome === subpasta.nome + ".txt"
      );
      if (arquivoUsuario) {
        const nomeUsuario = arquivoUsuario.conteudo
          .split("\n")[0]
          .split(" ")
          .slice(1)
          .join(" ");
        return nomeUsuario === username;
      }
      return false;
    });

    if (usuarioExistente) {
      return { success: false, message: `Usuário '${username}' já existe.` };
    }

    // Criar novo usuário
    const n_usuarios = pastaUsuarios.subpastas.length;
    const usuario = new Usuario(username, n_usuarios + 1);

    // Criar subpasta do usuário
    const subpasta_usuario = usuario.getPastaUsuario(pastaUsuarios);

    // Criar arquivo do usuário
    const arquivo_usuario = new Arquivo(
      subpasta_usuario.nome + ".txt",
      usuario.getInfo()
    );

    // Adicionar arquivo à subpasta
    subpasta_usuario.addArquivo(arquivo_usuario);

    // Adicionar subpasta à pasta de usuários
    pastaUsuarios.addSubPasta(subpasta_usuario);

    // Definir o novo usuário como ativo
    extraServices.definirUsuarioAtivo(usuario);

    return {
      success: true,
      message: `Usuário '${username}' criado com sucesso e ativado.`,
    };
  },

  save: (dir = Diretorio) => {
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

    criarDiretorio(dir.get_root(), caminhoBase);

    return {
      success: true,
      message: "Arquivos salvos com sucesso localmente.",
    };
  },

  chown: (args, dir = Diretorio) => {
    // Verificar se args.name existe e está no formato correto
    console.log(args);
    if (!args || typeof args !== "string") {
      return {
        success: false,
        message: "Formato inválido. Use: chown usuario nome",
      };
    }

    // Dividir args.name em partes
    const args_arr = args.split(" ");
    if (args_arr.length < 2) {
      return {
        success: false,
        message: "Formato inválido. Use: chown usuario nome",
      };
    }

    const username = args_arr[0]; // Nome do novo proprietário
    const targetName = args_arr.slice(1).join(" "); // Nome do arquivo ou diretório (pode conter espaços)

    // Verificar se o usuário existe
    const novoProprietario = searchServices.buscarUsuarioPorNome(dir, username);
    if (!novoProprietario) {
      return {
        success: false,
        message: `Usuário '${username}' não encontrado.`,
      };
    }

    // Verificar se o diretório raiz está disponível
    const rootDir = dir.get_root();
    if (!rootDir) {
      return {
        success: false,
        message: "Erro: Diretório raiz não disponível.",
      };
    }

    // Buscar o arquivo ou diretório pelo nome
    const arquivo = searchServices.findArq(dir, targetName);
    const diretorio = searchServices.findDir(dir, targetName);

    if (!arquivo && !diretorio) {
      return {
        success: false,
        message: `Arquivo ou diretório '${targetName}' não encontrado.`,
      };
    }

    // Alterar o proprietário do arquivo ou diretório
    if (arquivo) {
      arquivo.at(0).mudarProprietario(novoProprietario);
      return {
        success: true,
        message: `Proprietário do arquivo '${targetName}' alterado para '${username}'.`,
      };
    }

    if (diretorio) {
      diretorio.at(0).mudarProprietario(novoProprietario);
      return {
        success: true,
        message: `Proprietário do diretório '${targetName}' alterado para '${username}'.`,
      };
    }

    return {
      success: false,
      message: "Erro inesperado ao alterar o proprietário.",
    };
  },

  chmod: (input, dir = Diretorio) => {
    const [permissoes, nome] = input.split(" ").map((item) => item.trim());

    if (!permissoes || !nome) {
      return {
        success: false,
        message: "Formato inválido. Use: chmod permissao nome",
      };
    }

    // Verificar se o nome corresponde a um arquivo ou diretório
    const arquivo = searchServices.findArq(dir, nome);
    const diretorio = searchServices.findDir(dir, nome);

    if (arquivo) {
      arquivo.at(0).atualizarPermissoes(permissoes);
      return {
        success: true,
        message: `Permissões do arquivo '${nome}' alteradas para '${permissoes}'.`,
      };
    } else if (diretorio) {
      diretorio.at(0).atualizarPermissoes(permissoes);
      return {
        success: true,
        message: `Permissões do diretório '${nome}' alteradas para '${permissoes}'.`,
      };
    } else {
      return {
        success: false,
        message: `Arquivo ou diretório '${nome}' não encontrado.`,
      };
    }
  },

  // Comando para trocar de usuário
  su: (username, dir = Diretorio) => {
    if (!username) {
      return {
        success: false,
        message: "Formato inválido. Use: su usuario",
      };
    }

    // Buscar a pasta de usuários
    const pastaUsuarios = dir
      .get_root()
      .subpastas.find((pasta) => pasta.nome === "usuarios");

    if (!pastaUsuarios) {
      return { success: false, message: "Pasta de usuários não encontrada." };
    }

    // Buscar o usuário pelo nome
    const usuarioEncontrado = pastaUsuarios.subpastas.find((subpasta) => {
      const arquivoUsuario = subpasta.arquivos.find(
        (arquivo) => arquivo.nome === subpasta.nome + ".txt"
      );
      if (arquivoUsuario) {
        const nomeUsuario = arquivoUsuario.conteudo
          .split("\n")[0]
          .split(" ")
          .slice(1)
          .join(" ");
        return nomeUsuario === username;
      }
      return false;
    });

    if (!usuarioEncontrado) {
      return { success: false, message: "Usuário não encontrado." };
    }

    // Criar instância do usuário
    const arquivoUsuario = usuarioEncontrado.arquivos.find(
      (arquivo) => arquivo.nome === usuarioEncontrado.nome + ".txt"
    );
    const nomeUsuario = arquivoUsuario.conteudo
      .split("\n")[0]
      .split(" ")
      .slice(1)
      .join(" ");
    const idUsuario = arquivoUsuario.conteudo.split("\n")[1].split(" ")[1];
    const usuario = new Usuario(nomeUsuario, idUsuario);

    // Definir o usuário encontrado como ativo
    extraServices.definirUsuarioAtivo(usuario);

    return {
      success: true,
      message: `Usuário alterado para '${username}'.`,
    };
  },

  // Comando para verificar o usuário ativo
  whoami: () => {
    const usuario = extraServices.obterUsuarioAtivo();
    if (!usuario) {
      return { success: false, message: "Nenhum usuário ativo." };
    }
    return { success: true, message: usuario.nome };
  },
  executePipe: (commands, dir) => {
    if (!commands || typeof commands !== "string") {
      return {
        success: false,
        message: "Formato inválido. Use: pipe comando1 || comando2 || ...",
      };
    }

    // Dividir comandos pelo operador '||'
    const commandList = commands.split("||").map((cmd) => cmd.trim());

    let result;
    for (const command of commandList) {
      const [cmd, ...args] = command.split(" ");

      // Preparar os argumentos para passar ao comandoService
      const argsObj = { name: args.join(" ") };

      // Executar o comando
      result = comandoService.execute(cmd, argsObj);

      // Se algum comando falhar, interrompe a execução
      if (!result.success) {
        return result;
      }
    }

    return result; // Retorna o resultado do último comando executado
  },
};

export default extraServices;

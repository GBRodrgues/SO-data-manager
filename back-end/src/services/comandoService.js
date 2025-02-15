import Diretorio from "../models/Diretorio.js";
import dirServices from "./so_services/dirServices.js";
import fileServices from "./so_services/fileServices.js";
import navServices from "./so_services/navigationServices.js";
import searchServices from "./so_services/searchServices.js";
import infoServices from "./so_services/inforServices.js";
import advServices from "./so_services/advancedServices.js";
import extraServices from "./so_services/extrasServices.js";

const comandoService = {
  // Inicializando um diretório raiz para simular um sistema de arquivos
  root: Diretorio.setupRoot(),
  currentPath: "~", // Caminho atual
  usuarioAtivo: null, // Usuário ativo

  // Método para atualizar o prompt
  getPrompt: () => {
    const usuario = comandoService.usuarioAtivo;
    const caminho = comandoService.currentPath;
    return usuario ? `${usuario.nome}# ${caminho}$` : `~$`;
  },

  execute: (command, args) => {
    let dir = comandoService.root;
    switch (command) {
      // Comandos de manipulação de diretório
      case "mkdir":
        return dirServices.createDirectory(args.name, dir);
      case "rmdir":
        return dirServices.removeDirectory(args.name, dir);
      case "tree":
        return dirServices.showTree(dir);
      case "rename":
        return dirServices.rename(args.name, dir);

      // Comandos para manipulação de arquivos
      case "cat":
        return fileServices.showFileContent(args.name, dir);
      case "rm":
        return fileServices.remove(args.name, dir);
      case "touch":
        return fileServices.createFile(args.name, dir);
      case "wc":
        return fileServices.wc(args.name, dir);
      case "head":
        return fileServices.head(args.name, dir);
      case "tail":
        return fileServices.tail(args.name, dir);
      case "echo":
        return fileServices.echo(args.name, dir);

      // Navegação entre diretórios
      case "cd":
        let result = navServices.changeDirectory(args.name, dir);
        comandoService.root = result.at(0);
        comandoService.currentPath =
          navServices.printWorkingDirectory(dir).message;
        return result.at(1);

      case "pwd":
        return navServices.printWorkingDirectory(dir);

      // Busca e filtragem
      case "find":
        return searchServices.find(args.name, dir);
      case "grep":
        return searchServices.grep(args.name, dir);

      // Permissão e propriedades
      case "chown":
        return extraServices.chown(args.name, dir);

      case "chmod":
        return extraServices.chmod(args.name, dir);

      // Informações de arquivos e diretórios
      case "stat":
        return infoServices.getFileStats(args.name, dir);
      case "du":
        return dirServices.calculateDirectorySize(args.name, dir);

      // Operações avançadas
      case "cp":
        return advServices.cp(args.name, dir);
      case "mv":
        return advServices.mv(args.name, dir);
      case "diff":
        return advServices.diff(args.name, dir);
      case "zip":
        return advServices.zip(args.name, dir);
      case "unzip":
        return advServices.unzip(args.name, dir);

      // Extras
      case "adduser":
        const resultadoAddUser = extraServices.adduser(args.name, dir);
        if (resultadoAddUser.success) {
          comandoService.usuarioAtivo = extraServices.obterUsuarioAtivo();
        }
        return resultadoAddUser;

      case "save":
        return extraServices.save(dir);

      case "history":
        return {
          success: false,
          message: "Comando 'history' ainda deve ser implementado",
        };

      case "ls":
        if (args.name === "-l") {
          return extraServices.listContentsDetailed(dir);
        } else {
          return extraServices.listContents(dir);
        }

      case "su":
        const resultadoSu = extraServices.su(args.name, dir);
        if (resultadoSu.success) {
          comandoService.usuarioAtivo = extraServices.obterUsuarioAtivo();
        }
        return resultadoSu;

      case "whoami":
        return extraServices.whoami();

      default:
        return { success: false, message: "Comando inválido!" };
    }
  },

  getCamminho: () => {
    return navServices.printWorkingDirectory(comandoService.root);
  },
};

export default comandoService;

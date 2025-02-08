import Diretorio from "../models/Diretorio.js";
import Arquivo from "../models/Arquivo.js";
import Usuario from "../models/Usuario.js";


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
  currentPath: "~",
  execute: (command, args) => {
    let dir = comandoService.root;
    switch (command) {
      //comandos de manipulação de diretório
      case "mkdir":
        return dirServices.createDirectory(args.name, dir);
      case "rmdir":
        return dirServices.removeDirectory(args.name, dir);
      case "tree":
        return dirServices.showTree(dir);
      case "rename":
        return dirServices.rename(args.name, dir);

      //Comandos para manipulação de arquivos
      case "cat":
        return fileServices.showFileContent(args.name, dir);
      case "rm":
        return fileServices.remove(args.name, dir);
      case "touch":
        return fileServices.createFile(args.name, dir);
      case "wc":
        return fileServices.wc(args.name, dir); // Novo comando wc
      case "head":
        return fileServices.head(args.name, dir);
      case "tail":
        return fileServices.tail(args.name, dir);
      case "echo":
        return fileServices.echo(args.name, dir);

      //Navegação entre diretórios
      case "cd":
        let result = navServices.changeDirectory(args.name, dir);
        comandoService.root = result.at(0)
        return result.at(1)
      case "pwd":
        return navServices.printWorkingDirectory(dir);

      //busca e filtragem
      case "find"://corrigir
        return searchServices.find(args.name, dir);
      case "grep":
        return searchServices.grep(args.name, dir);

      //permissão e propriedades
      case "chown":
        return extraServices.chown(args.name), dir;

      //Informações de arquivos e diretórios
      case "stat":
        return infoServices.getFileStats(args.name, dir);
      case "du"://inforservices
        return { success: false, message: "Comando 'du' ainda não foi implementado" }

      //operacoes avancadas
      case "cp":
        return advServices.cp(args.name, dir);
      case "mv":
        return advServices.mv(args.name, dir); // Novo comando mv
      case "diff":
        return advServices.diff(args.name, dir);
      case "zip":
        return advServices.zip(args.name, dir);
      case "unzip":
        return advServices.unzip(args.name, dir);

      //Extras
      case "adduser":
        return extraServices.adduser(args.name, dir);
      case "save":
        return extraServices.save(dir);
      case "history":
        return { success: false, message: "Comando 'history' ainda deve ser implementado" }
      case "ls":
        return extraServices.listContents(dir);

      default:
        return { success: false, message: "Comando inválido!" };
    }
  },

  getCamminho: () =>{
    return navServices.printWorkingDirectory(comandoService.root);
  },

};

export default comandoService;

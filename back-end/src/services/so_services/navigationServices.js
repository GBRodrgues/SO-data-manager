import Diretorio from "../../models/Diretorio.js";
import dirServices from "./dirServices.js";

const navServices = {
  changeDirectory: (path, dir = Diretorio) => {
    var pasta_atual = dir;

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
      dir = pasta_atual;
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
          var diretorio = dirServices.findDirectory(destino, dir); //procurando diretorio com o nome
          if (diretorio) {
            pasta_atual = diretorio;
          } else {
            pasta_atual = null;
            return null;
          }
        }
      }
      if (pasta_atual) {
        dir = pasta_atual; // se encontrar a pasta da repetição, muda o root para essa
      } else {
        return null;
      }
    });
    //se tiver verificado todas as pastas do caminho, e tiver econtrado. Retorna succes
    if (pasta_atual != null) {
      return [
        dir,
        { success: true, message: `Diretório alterado para ${path}` },
      ];
    } else {
      return [
        null,
        { success: false, message: `Diretório ${path} não encontrado` },
      ];
    }
  },

  printWorkingDirectory: (dir = Diretorio) => {
    return { success: true, message: dir.printWorkDirectory() };
  },
};
export default navServices;

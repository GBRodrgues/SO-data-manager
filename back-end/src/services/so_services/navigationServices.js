import Diretorio from "../../models/Diretorio.js";
import dirServices from "./dirServices.js";

const navServices = {
  changeDirectory: (path, dir = Diretorio) => {
    let pasta_atual = dir;

    if (path === "/" || path === "~") {
      // Voltar para o diretório raiz
      while (pasta_atual.diretorioPai !== null) {
        pasta_atual = pasta_atual.diretorioPai;
      }
      return [
        pasta_atual,
        { success: true, message: `Retornamos à pasta raiz (~).` },
      ];
    }

    const rota = path.split("/");

    for (let destino of rota) {
      if (destino === "..") {
        // Voltar para o diretório pai
        if (pasta_atual.diretorioPai === null) {
          return [
            null,
            { success: false, message: "Você já está na pasta raiz." },
          ];
        }
        pasta_atual = pasta_atual.diretorioPai;
      } else if (destino !== "." && destino !== "") {
        // Navegar para um subdiretório
        const diretorio = dirServices.findDirectory(destino, pasta_atual);
        if (!diretorio) {
          return [
            null,
            {
              success: false,
              message: `Diretório '${destino}' não encontrado.`,
            },
          ];
        }
        pasta_atual = diretorio;
      }
    }

    // Retorna o nome do diretório atual após a mudança
    return [
      pasta_atual,
      { success: true, message: `Diretório alterado para ${pasta_atual.nome}` },
    ];
  },

  printWorkingDirectory: (dir = Diretorio) => {
    return { success: true, message: dir.printWorkDirectory() };
  },
};

export default navServices;

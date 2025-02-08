import Diretorio from "../../models/Diretorio.js";

const infoServices = {
  getFileStats: (name, dir=Diretorio) => {
    if (!name) {
      return {
        success: false,
        message: "Nome do arquivo/diretorio obrigatório.",
      };
    }

    const file = dir.arquivos.find((f) => f.nome === name);
    if (file) {
      return { success: true, message: file.getStats() };
    }

    const dirFound = dir.subpastas.find((f) => f.nome === name);
    if (dirFound) {
      return { success: true, message: dirFound.getStats() };
    }
    return {
      success: true,
      message: `Arquivo ou diretorio ${name} não encontrado`,
    };
  },
}
export default infoServices;
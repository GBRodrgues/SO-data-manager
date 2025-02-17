import Diretorio from "../../models/Diretorio.js";

const infoServices = {
  getFileStats: (name, dir = Diretorio) => {
    if (!name) {
      return {
        success: false,
        message: "Nome do arquivo/diretorio obrigatório.",
      };
    }

    // Verifica se o arquivo existe
    const file = dir.arquivos?.find((f) => f.nome === name);
    if (file) {
      return { success: true, message: file.getStats() }; // Chama getStats corretamente
    }

    // Verifica se o diretório existe
    const dirFound = dir.subpastas?.find((f) => f.nome === name);
    if (dirFound) {
      return { success: true, message: dirFound.getStats() }; // Chama getStats corretamente
    }

    // Caso não encontre o arquivo ou diretório
    return {
      success: false,
      message: `Arquivo ou diretório ${name} não encontrado.`,
    };
  },
};
export default infoServices;

import Diretorio from "../../models/Diretorio.js";
import dirServices from "./dirServices.js";

const searchServices = {

  find: (input, dir=Diretorio) => {
    // Divide o input para extrair o tipo de busca (diretório ou arquivo) e o nome
    const [tipo, nome] = input.split(" ").map((item) => item.trim());
    console.log(tipo)
    console.log(nome)

    if (!tipo || !nome) {
      return {
        success: false,
        message:
          "Formato inválido. Use: find directory nome ou find arquivo nome",
      };
    }

    if (tipo === "dir") {
      const resultado = searchServices.findDir(dir, nome);
      if (resultado) {
        return {
          success: true,
          message: `Diretório encontrado: ${resultado.at(1)}`,
        };
      } else {
        return {
          success: false,
          message: `Diretório '${nome}' não encontrado.`,
        };
      }
    } else if (tipo === "arq") {
      const resultado = searchServices.findArq(dir, nome);
      if (resultado) {
        return {
          success: true,
          message: `Arquivo encontrado: ${resultado.at(1)}`,
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

  grep: (input, dir=Diretorio) => {
    // Divide o input para extrair o termo e o nome do arquivo
    const [termo, arquivoNome] = input.split(" ").map((item) => item.trim());

    if (!termo || !arquivoNome) {
      return {
        success: false,
        message: "Formato inválido. Use: grep termo arquivo",
      };
    }

    // Encontra o arquivo
    const arquivo = searchServices.findArq(dir, arquivoNome);
    if (!arquivo) {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }

    // Lê o conteúdo do arquivo
    const conteudo = arquivo.conteudo;

    // Divide o conteúdo em linhas
    const linhas = String(conteudo).split("\n");

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

  findDir: (diretorioAtual, nome, caminhoAtual = "") => {
    // Define o caminho atual
    const caminho = caminhoAtual
      ? `${caminhoAtual}/${diretorioAtual.nome}`
      : diretorioAtual.nome;

    // Verifica se o diretório atual é o que estamos procurando
    if (diretorioAtual.nome === nome) {
      return [diretorioAtual, caminho];
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = searchServices.findDir(subdiretorio, nome, caminho);
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
      return [arquivo, `${caminho}/${arquivo.nome}`];
    }

    // Busca recursivamente nas subpastas
    for (const subdiretorio of diretorioAtual.subpastas) {
      const resultado = searchServices.findArq(subdiretorio, nome, caminho);
      if (resultado) {
        return resultado;
      }
    }

    // Se não encontrou, retorna null
    return null;
  },


}
export default searchServices;
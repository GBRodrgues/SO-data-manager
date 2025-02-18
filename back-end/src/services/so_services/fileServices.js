import Diretorio from "../../models/Diretorio.js";
import Arquivo from "../../models/Arquivo.js";
import searchServices from "./searchServices.js";
import extraServices from "./extrasServices.js";

const fileServices = {
  findArquivo: (name, dir = Diretorio) => {
    return dir.arquivos.find((arquivo) => arquivo.nome === name);
  },

  showFileContent: (name, dir = Diretorio) => {
    const arquivo = searchServices.findArq(dir, name);
    if (!arquivo) {
      return { success: false, message: "Arquivo não existe." };
    }
    return { success: true, message: arquivo.at(0).read() };
  },

  remove: (name, dir = Diretorio) => {
    const arquivo = dir.arquivos.find((arquivo) => arquivo.nome === name);
    const subpasta = dir.subpastas.find((arquivo) => arquivo.nome === name);
    if (!arquivo && !subpasta) {
      return {
        success: false,
        message: "Nenhum arquivo ou subasta encontrada com esse nome.",
      };
    }
    if (subpasta) {
      dir.removeSubPasta(name);
      return {
        success: true,
        message: `Pasta '${name}' removida com sucesso!`,
      };
    }
    dir.removeArquivo(name);
    return {
      success: true,
      message: `Arquivo '${name}' removido com sucesso!`,
    };
  },

  createFile: (name, dir = Diretorio) => {
    if (!name) {
      return { success: false, message: "Nome do arquivo obrigatório." };
    }

    if (dir.arquivos.find((arquivo) => arquivo.nome === name)) {
      return { success: false, message: "Já existe um arquivo com esse nome." };
    }
    const proprAtual = extraServices.obterUsuarioAtivo();
    const file = new Arquivo(name, "", proprAtual);
    dir.addArquivo(file);
    return { success: true, message: `Arquivo '${name}' criado` };
  },

  wc: (arquivoNome, dir = Diretorio) => {
    if (!arquivoNome) {
      return { success: false, message: "Nome do arquivo é obrigatório." };
    }

    const arquivo = fileServices.findArquivo(arquivoNome, dir);
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

  head: (input, dir = Diretorio) => {
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

    const arquivo = fileServices.findArquivo(arquivoNome, dir);
    if (!arquivo) {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }

    const linhas = arquivo.conteudo.split("\n");
    const primeirasLinhas = linhas.slice(0, numLinhas).join("\n");

    return {
      success: true,
      message: `Primeiras ${numLinhas} linhas do arquivo '${arquivoNome}':\n${primeirasLinhas}`,
    };
  },

  tail: (input, dir = Diretorio) => {
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

    const arquivo = fileServices.findArquivo(arquivoNome, dir);
    if (!arquivo) {
      return {
        success: false,
        message: `Arquivo '${arquivoNome}' não encontrado.`,
      };
    }

    const linhas = arquivo.conteudo.split("\n");
    const ultimasLinhas = linhas.slice(-numLinhas).join("\n");

    return {
      success: true,
      message: `Últimas ${numLinhas} linhas do arquivo '${arquivoNome}':\n${ultimasLinhas}`,
    };
  },

  writeFile: (input, dir = Diretorio) => {
    const [texto, arquivoNome] = input.split(">").map((item) => item.trim());

    if (!arquivoNome) {
      return { success: false, message: "Nome do arquivo é obrigatório." };
    }

    const arquivo = fileServices.findArquivo(arquivoNome, dir);

    if (arquivo) {
      arquivo.write(texto);
      return {
        success: true,
        message: `Conteúdo do arquivo '${arquivoNome}' sobrescrito.`,
      };
    } else {
      const novoArquivo = new Arquivo(arquivoNome);
      novoArquivo.write(texto);
      dir.addArquivo(novoArquivo);
      return {
        success: true,
        message: `Arquivo '${arquivoNome}' criado com o conteúdo.`,
      };
    }
  },

  appendToFile: (input, dir) => {
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

    const arquivo = fileServices.findArquivo(arquivoNome, dir);

    if (arquivo) {
      arquivo.append(texto);
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

  echo: (input, dir = Diretorio) => {
    if (input.includes(">>")) {
      return fileServices.appendToFile(input, dir);
    } else if (input.includes(">")) {
      return fileServices.writeFile(input, dir);
    } else {
      return {
        success: false,
        message:
          'Formato inválido. Use: echo "texto" > arquivo.txt ou echo "texto" >> arquivo.txt',
      };
    }
  },
};

export default fileServices;

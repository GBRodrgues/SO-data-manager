import Diretorio from "../../models/Diretorio.js";
import searchServices from "./searchServices.js";
import extraServices from "./extrasServices.js";

const dirServices = {
  createDirectory: (name, dir = Diretorio) => {
    if (!name) {
      return { success: false, message: "Nome obrigatório." };
    }

    const dirExists = searchServices.findDir(dir, name);
    if (dirExists) {
      return { success: false, message: `O diretório '${name}' já existe` };
    }
    const proprAtual = extraServices.obterUsuarioAtivo();
    const newDir = new Diretorio(name, dir, proprAtual);
    dir.addSubPasta(newDir);
    return {
      success: true,
      message: `Diretório '${name}' criado com sucesso.`,
    };
  },

  removeDirectory: (name, dir = Diretorio) => {
    if (!name) {
      return { success: false, message: "Nome obrigatório." };
    }

    const dirFound = searchServices.findDir(dir, name);
    if (!dirFound) {
      return { success: false, message: `Diretório '${name}' não existe.` };
    }

    dir.removeSubPasta(name);
    return { success: true, message: `Diretório '${name}' removido` };
  },

  showTree: (dir = Diretorio) => {
    var root = dir.get_root();
    let result = root.nome;

    const printTree = (dir, prefix = "", string_final) => {
      const subpastas = dir.subpastas;
      const arquivos = dir.arquivos;
      const total = subpastas.length + arquivos.length;

      subpastas.forEach((pasta, index) => {
        const isLast = index === total - 1;
        string_final = string_final.concat(
          prefix + (isLast ? "└── " : "├── ") + pasta.nome + "\n"
        );
        string_final = printTree(
          pasta,
          prefix + (isLast ? "    " : "│   "),
          string_final
        );
      });

      arquivos.forEach((arquivo, index) => {
        const isLast = index === arquivos.length - 1;
        string_final = string_final.concat(
          prefix + (isLast ? "└── " : "├── ") + arquivo.nome + "\n"
        );
      });
      return string_final;
    };

    result = printTree(root, "", result + "\n");
    return { success: true, message: result };
  },

  rename: (nomes, dir = Diretorio) => {
    let vetor_nomes = nomes.split(" ");
    let nome_antigo = vetor_nomes[0];
    let nome_novo = vetor_nomes[1];
    let arquivo = searchServices.findArq(dir, nome_antigo);
    let dirFound = searchServices.findDir(dir, nome_antigo);

    if (arquivo) {
      arquivo.at(0).atualizarNome(nome_novo);
      return {
        success: true,
        message: `Nome do arquivo alterado de "${nome_antigo}" para "${nome_novo}"`,
      };
    }
    if (dirFound) {
      dirFound.at(0).atualizarNome(nome_novo);
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

  calculateDirectorySize: (name, dir = Diretorio) => {
    console.log(`Procurando diretório: ${name}`);
    const targetDir = dirServices.findDirectory(name, dir);

    if (!targetDir) {
      console.log(`Diretório '${name}' não encontrado.`);
      return { success: false, message: `Diretório '${name}' não encontrado.` };
    }

    console.log(`Diretório encontrado: ${targetDir.nome}`);
    const totalSize = dirServices.calculateSize(targetDir);

    return {
      success: true,
      message: `Tamanho do diretório '${name}': ${totalSize} bytes`,
    };
  },

  calculateSize: (dir) => {
    let totalSize = 0;

    // Somar o tamanho dos arquivos no diretório atual
    dir.arquivos.forEach((arquivo) => {
      totalSize += arquivo.conteudo.length || 0; // Usar o comprimento do conteúdo como tamanho
    });

    // Somar o tamanho dos subdiretórios recursivamente
    dir.subpastas.forEach((subpasta) => {
      totalSize += dirServices.calculateSize(subpasta);
    });

    return totalSize;
  },

  findDirectory: (name, dir = Diretorio) => {
    if (!dir || !dir.subpastas) {
      return null;
    }
    const dirFound = dir.subpastas.find((pasta) => pasta.nome === name);
    return dirFound || null;
  },
};

export default dirServices;

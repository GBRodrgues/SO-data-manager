import Diretorio from "../../models/Diretorio.js";
import Arquivo from "../../models/Arquivo.js";
import searchServices from "./searchServices.js";

const advServices = {
  cp: (input, dir = Diretorio) => {
    // Divide o input para extrair a origem e o destino
    const [origem, destino] = input.split(" ").map((item) => item.trim());

    if (!origem || !destino) {
      return {
        success: false,
        message: "Formato inválido. Use: cp origem destino",
      };
    }

    // Encontra o arquivo ou diretório de origem
    let arquivoOrigem = searchServices.findArq(dir, origem);
    let diretorioOrigem = searchServices.findDir(dir, origem);

    if (!arquivoOrigem && !diretorioOrigem) {
      return { success: false, message: `Origem '${origem}' não encontrada.` };
    }

    // Encontra o diretório de destino
    let diretorioDestino = searchServices.findDir(dir, destino);
    if (!diretorioDestino) {
      return {
        success: false,
        message: `Destino '${destino}' não encontrado.`,
      };
    }
    diretorioDestino = diretorioDestino.at(0);
    // Copia o arquivo ou diretório
    if (arquivoOrigem) {
      arquivoOrigem = arquivoOrigem.at(0);
      const novoArquivo = new Arquivo(
        arquivoOrigem.nome,
        arquivoOrigem.conteudo,
        arquivoOrigem.proprietario
      );
      diretorioDestino.arquivos.push(novoArquivo);
      return {
        success: true,
        message: `Arquivo '${origem}' copiado para '${destino}'.`,
      };
    } else if (diretorioOrigem) {
      diretorioOrigem = diretorioOrigem.at(0);
      const novoDiretorio = new Diretorio(
        diretorioOrigem.nome,
        diretorioOrigem.pai,
        diretorioOrigem.proprietario
      );
      novoDiretorio.arquivos = diretorioOrigem.arquivos;
      novoDiretorio.subpastas = diretorioOrigem.subpastas;
      novoDiretorio.permissoes = diretorioOrigem.permissoes;
      diretorioDestino.subpastas.push(novoDiretorio);
      return {
        success: true,
        message: `Diretório '${origem}' copiado para '${destino}'.`,
      };
    }
  },

  mv: (input, dir = Diretorio) => {
    // Divide o input para extrair a origem e o destino
    const [origem, destino] = input.split(" ").map((item) => item.trim());

    if (!origem || !destino) {
      return {
        success: false,
        message: "Formato inválido. Use: mv origem destino",
      };
    }

    // Encontra o arquivo ou diretório de origem
    let arquivoOrigem = searchServices.findArq(dir, origem);
    let diretorioOrigem = searchServices.findDir(dir, origem);

    if (!arquivoOrigem && !diretorioOrigem) {
      return { success: false, message: `Origem '${origem}' não encontrada.` };
    }

    // Encontra o diretório de destino
    let diretorioDestino = searchServices.findDir(dir, destino);
    if (!diretorioDestino) {
      return {
        success: false,
        message: `Destino '${destino}' não encontrado.`,
      };
    }
    diretorioDestino = diretorioDestino.at(0);

    // Move o arquivo ou diretório
    if (arquivoOrigem) {
      arquivoOrigem = arquivoOrigem.at(0);
      // Remove o arquivo da origem
      console.log(origem);
      console.log(origem.split("/").slice(0, -1).join("/"));
      dir.arquivos = dir.arquivos.filter(
        (arquivo) => arquivo.nome !== arquivoOrigem.nome
      );

      // Adiciona o arquivo ao destino
      diretorioDestino.arquivos.push(arquivoOrigem);
      return {
        success: true,
        message: `Arquivo '${origem}' movido para '${destino}'.`,
      };
    } else if (diretorioOrigem) {
      diretorioOrigem = diretorioOrigem.at(0);
      // Remove o diretório da origem
      dir.subpastas = dir.subpastas.filter(
        (subdir) => subdir.nome !== diretorioOrigem.nome
      );

      // Adiciona o diretório ao destino
      diretorioDestino.subpastas.push(diretorioOrigem);
      return {
        success: true,
        message: `Diretório '${origem}' movido para '${destino}'.`,
      };
    }
  },

  diff: (input, dir = Diretorio) => {
    // Divide o input para extrair os nomes dos arquivos
    const [arquivo1, arquivo2] = input.split(" ").map((item) => item.trim());

    if (!arquivo1 || !arquivo2) {
      return {
        success: false,
        message: "Formato inválido. Use: diff arquivo1 arquivo2",
      };
    }

    // Encontra os arquivos
    const arquivo1Obj = searchServices.findArq(dir, arquivo1);
    const arquivo2Obj = searchServices.findArq(dir, arquivo2);

    if (!arquivo1Obj) {
      return {
        success: false,
        message: `Arquivo '${arquivo1}' não encontrado.`,
      };
    }
    if (!arquivo2Obj) {
      return {
        success: false,
        message: `Arquivo '${arquivo2}' não encontrado.`,
      };
    }

    // Compara o conteúdo dos arquivos
    const conteudo1 = arquivo1Obj.at(0).conteudo.split("\n");
    const conteudo2 = arquivo2Obj.at(0).conteudo.split("\n");

    const diff = advServices.compararConteudo(conteudo1, conteudo2);

    if (diff.length === 0) {
      return { success: true, message: "Os arquivos são idênticos." };
    } else {
      return {
        success: true,
        message: `Diferenças encontradas:\n${diff.join("\n")}`,
      };
    }
  },

  compararConteudo: (conteudo1, conteudo2) => {
    const diff = [];
    const maxLines = Math.max(conteudo1.length, conteudo2.length);

    for (let i = 0; i < maxLines; i++) {
      const linha1 = conteudo1[i] || "";
      const linha2 = conteudo2[i] || "";

      if (linha1 !== linha2) {
        diff.push(`Linha ${i + 1}:\n< ${linha1}\n> ${linha2}`);
      }
    }

    return diff;
  },

  zip: (input, dir = Diretorio) => {
    // Divide o input para extrair o nome do arquivo .zip e os itens a serem compactados
    const [arquivoZip, ...itens] = input.split(" ").map((item) => item.trim());

    if (!arquivoZip || itens.length === 0) {
      return {
        success: false,
        message: "Formato inválido. Use: zip arquivo.zip item1 item2 ...",
      };
    }

    // Verifica se o arquivo .zip já existe
    if (searchServices.findArq(dir, arquivoZip)) {
      return { success: false, message: `Arquivo '${arquivoZip}' já existe.` };
    }

    // Coleta os itens a serem compactados
    const itensCompactados = [];
    for (const item of itens) {
      let arquivo = searchServices.findArq(dir, item);
      let diretorio = searchServices.findDir(dir, item);

      if (!arquivo && !diretorio) {
        return { success: false, message: `Item '${item}' não encontrado.` };
      }

      if (arquivo) {
        arquivo = arquivo.at(0);
        itensCompactados.push({
          tipo: "arquivo",
          nome: arquivo.nome,
          conteudo: arquivo.conteudo,
        });
      } else if (diretorio) {
        diretorio = diretorio.at(0);
        itensCompactados.push({
          tipo: "diretorio",
          nome: diretorio.nome,
          itens: diretorio.arquivos.concat(diretorio.subpastas),
        });
      }
    }

    // Cria o arquivo .zip (simulado)
    const arquivoZipObj = new Arquivo(arquivoZip + ".zip");
    arquivoZipObj.conteudo = JSON.stringify(itensCompactados); // Simula a compactação
    dir.arquivos.push(arquivoZipObj);

    return {
      success: true,
      message: `Itens compactados em ${arquivoZip}.zip`,
    };
  },

  unzip: (input, dir = Diretorio) => {
    // Extrai o nome do arquivo .zip
    const arquivoZip = input.trim();

    if (!arquivoZip) {
      return {
        success: false,
        message: "Formato inválido. Use: unzip arquivo.zip",
      };
    }

    // Encontra o arquivo .zip
    let arquivoZipObj = searchServices.findArq(dir, arquivoZip);
    if (!arquivoZipObj) {
      return {
        success: false,
        message: `Arquivo '${arquivoZip}' não encontrado.`,
      };
    }

    // "Descompacta" o arquivo .zip (simulado)
    try {
      const itensCompactados = JSON.parse(arquivoZipObj.at(0).conteudo);
      const mensagens = [];

      for (const item of itensCompactados) {
        let nomeFinal = item.nome;

        // Verifica se o item já existe no diretório atual
        if (
          searchServices.findArq(dir, nomeFinal) ||
          searchServices.findDir(dir, nomeFinal)
        ) {
          let contador = 1;
          while (
            searchServices.findArq(dir, `${nomeFinal} Cópia(${contador})`) ||
            searchServices.findDir(dir, `${nomeFinal} Cópia(${contador})`)
          ) {
            contador++;
          }
          nomeFinal = `${nomeFinal} Cópia(${contador})`;
        }

        if (item.tipo === "arquivo") {
          const novoArquivo = new Arquivo(nomeFinal, item.conteudo);
          dir.arquivos.push(novoArquivo);
          mensagens.push(`Arquivo '${nomeFinal}' extraído.`);
        } else if (item.tipo === "diretorio") {
          const novoDiretorio = new Diretorio(nomeFinal);
          novoDiretorio.arquivos = item.itens.filter(
            (i) => i.tipo === "arquivo"
          );
          novoDiretorio.subpastas = item.itens.filter(
            (i) => i.tipo === "diretorio"
          );
          dir.subpastas.push(novoDiretorio);
          mensagens.push(`Diretório '${nomeFinal}' extraído.`);
        }
      }

      return {
        success: true,
        message: `Arquivo '${arquivoZip}' descompactado com sucesso:\n${mensagens.join(
          "\n"
        )}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao descompactar o arquivo '${arquivoZip}'.`,
      };
    }
  },
};
export default advServices;

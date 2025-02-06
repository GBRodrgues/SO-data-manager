import Arquivo from "./Arquivo.js";

class Diretorio {
  constructor(nome, pai = null) {
    this.nome = nome;
    this.arquivos = [];
    this.subpastas = [];
    this.dataModificacao = Date.now();
    this.diretorioPai = pai;
  }

  static setupRoot() {
    const rootDir = new Diretorio("~");
    rootDir.addArquivo(
      new Arquivo("hello_world.txt", "Olá\nArquivo de testes!")
    );
    rootDir.addSubPasta(new Diretorio("usr", rootDir));
    return rootDir;
  }

  addArquivo(arquivo) {
    if (arquivo instanceof Arquivo) {
      this.arquivos.push(arquivo);
    } else {
      console.error(
        "Erro: Tentativa de adicionar um objeto inválido como arquivo."
      );
    }
  }

  addSubPasta(subpasta) {
    if (subpasta instanceof Diretorio) {
      this.subpastas.push(subpasta);
    } else {
      console.error(
        "Erro: Tentativa de adicionar um objeto inválido como subpasta."
      );
    }
  }

  removeArquivo(nomeArquivo) {
    this.arquivos = this.arquivos.filter(
      (arquivo) => arquivo.nome !== nomeArquivo
    );
  }

  removeSubPasta(nomePasta) {
    this.subpastas = this.subpastas.filter((pasta) => pasta.nome !== nomePasta);
  }

  atualizarNome(novoNome) {
    if (novoNome) this.nome = novoNome;
  }

  getDiretorioPai() {
    return this.diretorioPai;
  }

  listContents() {
    return {
      arquivos: this.arquivos.map((arquivo) => arquivo.nome),
      subpastas: this.subpastas.map((pasta) => pasta.nome),
    };
  }

  printWorkDirectory() {
    return this.diretorioPai
      ? `${this.diretorioPai.printWorkDirectory()}/${this.nome}`
      : this.nome;
  }
}

export default Diretorio;

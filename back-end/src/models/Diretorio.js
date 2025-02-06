import Arquivo from "./Arquivo.js";
<<<<<<< HEAD

class Diretorio {
  constructor(nome, pai = null) {
    this.nome = nome;
    this.arquivos = [];
    this.subpastas = [];
    this.dataModificacao = Date.now();
    this.diretorioPai = pai;
  }
=======
class Diretorio {


    constructor(nome, pai) {
        this.nome = nome;
        this.arquivos = [];
        this.subpastas = [];
        this.data_modificacao = Date.now();
        this.diretorioPai = pai;
    }

    static setupRoot(){
        var rootDir = new Diretorio('~', null);
        let hello_world = new Arquivo('hello_world.txt','Olá\nArquivo de testes!');
        rootDir.addArquivo(hello_world);
        let usr = new Diretorio('usr', rootDir);
        rootDir.addSubPasta(usr);
        return rootDir;
    }
>>>>>>> 3d0a9d2c78e47ec7be62a46c023a308c8db382d7

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

<<<<<<< HEAD
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

  get_root(){
    if (this.nome == '~'){
      return this;
    }
    return this.diretorioPai.get_root();
  }

  printWorkDirectory() {
    return this.diretorioPai
      ? `${this.diretorioPai.printWorkDirectory()}/${this.nome}`
      : this.nome;
  }
=======
    updateNome(nome){
        this.nome = nome;
    }

    getDiretorioPai(){
        return this.diretorioPai;
    }

    listContents() {
        return {
            arquivos: this.arquivos.map(f => f.nome),
            subpastas: this.subpastas.map(d => d.nome)
        };
    }

    printWorkDirectory(){
        if(this.nome == '~'){
            return this.nome;
        }
        return this.diretorioPai.printWorkDirectory() + '/' + this.nome
    }
>>>>>>> 3d0a9d2c78e47ec7be62a46c023a308c8db382d7
}

export default Diretorio;

import Arquivo from "./Arquivo.js";
import Usuario from "./Usuario.js";
import Permissao from "./Permissao.js";
import extraServices from "../services/so_services/extrasServices.js";

class Diretorio {
  constructor(nome, pai, proprietario) {
    this.nome = nome;
    this.arquivos = [];
    this.subpastas = [];
    this.data_modificacao = Date.now();
    this.diretorioPai = pai;
    this.tamanho = 0;
    this.proprietario = proprietario;
    this.permissoes = new Permissao(true, true, false);
  }

  static setupRoot() {
    var rootDir = new Diretorio("~", null);
    let hello_world = new Arquivo("hello_world.txt", "Olá\nArquivo de testes!");
    rootDir.addArquivo(hello_world);

    let usr = new Diretorio("usuarios", rootDir);
    const n_usuarios = usr.subpastas.length;
    const usuario = new Usuario("sudo", n_usuarios + 1);
    usr.mudarProprietario(usuario);
    rootDir.addSubPasta(usr);
    rootDir.mudarProprietario(usuario);

    const subpasta_usuario = usuario.getPastaUsuario(usr);
    const arquivo_usuario = new Arquivo(
      subpasta_usuario.nome + ".txt",
      usuario.getInfo()
    );
    subpasta_usuario.addArquivo(arquivo_usuario);
    extraServices.definirUsuarioAtivo(usuario);
    usr.addSubPasta(subpasta_usuario);
    return rootDir;
  }

  mudarProprietario(usuario) {
    this.proprietario = usuario;
  }

  mudarPermissoes(permi) {
    console.log(this.owner);
  }

  getProprietario() {
    return this.proprietario;
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

  get_root() {
    let current = this;
    while (current.diretorioPai !== null) {
      current = current.diretorioPai;
    }
    return current;
  }

  printWorkDirectory() {
    return this.diretorioPai
      ? `${this.diretorioPai.printWorkDirectory()}/${this.nome}`
      : this.nome;
  }

  getTamanho() {
    return sizeof(this);
  }

  getStats() {
    return `Nome: ${this.nome},\nProprietário: ${this.proprietario?.nome}`;
  }
  atualizarPermissoes(permissoes) {
    this.permissoes.definirPermissoes(permissoes);
  }

  getPermissoes() {
    return this.permissoes.toString();
  }
  getInfo() {
    return {
      nome: this.nome,
      subpastas: this.subpastas.map((subpasta) => subpasta.nome),
      arquivos: this.arquivos.map((arquivo) => arquivo.nome),
    };
  }
}

export default Diretorio;

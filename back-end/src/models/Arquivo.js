import Permissao from "./Permissao.js";

class Arquivo {
  constructor(nome, conteudo = "", proprietario) {
    this.nome = nome;
    this.conteudo = conteudo;
    this.data_modificacao = Date.now();
    this.proprietario = proprietario;
    this.permissoes = new Permissao(true, true, false); // Permissões padrão: leitura e escrita
  }

  write(conteudo) {
    this.conteudo = conteudo;
  }

  append(conteudo) {
    this.conteudo += `\n${conteudo}`;
  }

  read() {
    return this.conteudo;
  }
  atualizarNome(nome) {
    this.nome = nome;
  }

  mudarProprietario(usuario) {
    this.proprietario = usuario;
  }

  getStats() {
    return `Nome: ${this.nome}\nProprietário: ${this.proprietario?.nome}\nTamanho: ${this.conteudo.length} bytes`;
  }

  getTamanho() {
    return sizeof(this);
  }

  atualizarPermissoes(permissoes) {
    this.permissoes.definirPermissoes(permissoes);
  }

  getPermissoes() {
    return this.permissoes.toString();
  }

  static create_from_arquivo(conteudo=String){
    valores = conteudo.split("\n")
    console.log(valores )

  }
}

export default Arquivo;

import Permissao from "./Permissao.js";

class Arquivo {
  constructor(nome, conteudo = "", proprietario) {
    this.nome = nome;
    this.conteudo = conteudo;
    this.data_modificacao = Date.now();
    this.owner = proprietario;
    this.permissoes = new Permissao(true, true, false); // Permissões padrão: leitura e escrita
    this.proprietario = proprietario;
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
    return (
      `Nome: ${this.nome}\nProprietário: ${this.owner.nome}`,
      `tamanho: ${this.conteudo.length}`
    );
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
}

export default Arquivo;

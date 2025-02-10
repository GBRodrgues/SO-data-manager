class Arquivo {
  constructor(nome, conteudo = "", proprietario) {
    this.nome = nome;
    this.conteudo = conteudo;
    this.data_modificacao = Date.now();
    this.owner = proprietario;
    // this.usuariosPermitidos = [];
    // this.usuariosPermitidos.push(usuariosPermitidos);//lista de usuários permitidos
    //Permissão podemos inserir como atributo dessa classe, criando uma nova classe 'usuario' e inserindo cada usuário nessa lista de usuários permitidos
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

  mudarProprietario(prop){
    this.owner = prop;
  }

  getStats() {
    return `Nome: ${this.nome}\nProprietário: ${this.owner.nome}`
  }

  getTamanho() {
    return sizeof(this)
  }
}

export default Arquivo;

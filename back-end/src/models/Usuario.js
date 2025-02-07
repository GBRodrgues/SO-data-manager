export default class Usuario {
  constructor(nome, admin) {
    this.nome = nome;
    this.admin = admin;
  }

  mudaNome(novoNome) {
    this.nome = novoNome;
    return "Nome alterado com sucesso";
  }

  setAdmin(isAdmin) {
    // true ou false
    this.admin = isAdmin;
  }
}

class Permissao {
  constructor(leitura = false, escrita = false, execucao = false) {
    this.leitura = leitura;
    this.escrita = escrita;
    this.execucao = execucao;
  }

  // Método para definir permissões a partir de uma string (ex: "rwx")
  definirPermissoes(permissoes) {
    this.leitura = permissoes.includes("r");
    this.escrita = permissoes.includes("w");
    this.execucao = permissoes.includes("x");
  }

  // Método para retornar as permissões como string (ex: "rw-")
  toString() {
    return `${this.leitura ? "r" : "-"}${this.escrita ? "w" : "-"}${
      this.execucao ? "x" : "-"
    }`;
  }
}

export default Permissao;

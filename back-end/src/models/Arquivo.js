class Arquivo {
<<<<<<< HEAD
  constructor(nome, conteudo = "") {
    this.nome = nome;
    this.conteudo = conteudo;
    // this.usuariosPermitidos = [];
    // this.usuariosPermitidos.push(usuariosPermitidos);//lista de usuários permitidos
    //Permissão podemos inserir como atributo dessa classe, criando uma nova classe 'usuario' e inserindo cada usuário nessa lista de usuários permitidos
  }
=======
    constructor(nome, conteudo = '') {
        this.nome = nome;
        this.conteudo = conteudo;
        // this.usuariosPermitidos = []; 
        // this.usuariosPermitidos.push(usuariosPermitidos);//lista de usuários permitidos
        //Permissão podemos inserir como atributo dessa classe, criando uma nova classe 'usuario' e inserindo cada usuário nessa lista de usuários permitidos
    }
>>>>>>> 3d0a9d2c78e47ec7be62a46c023a308c8db382d7

  write(conteudo) {
    this.conteudo = conteudo;
  }

  append(conteudo) {
    this.conteudo += `\n${conteudo}`;
  }

  read() {
    return this.conteudo;
  }

<<<<<<< HEAD
  updateNome(nome) {
    this.nome = nome;
  }

  getStats() {
    return {
      nome: this.nome,
      size: this.conteudo.length,
      lines: this.conteudo.split("\n").length,
    };
  }
=======
    updateNome(nome){
        this.nome = nome;
    }


    getStats() {
        return {
            nome: this.nome,
            size: this.conteudo.length,
            lines: this.conteudo.split('\n').length
        };
    }
>>>>>>> 3d0a9d2c78e47ec7be62a46c023a308c8db382d7
}

export default Arquivo;

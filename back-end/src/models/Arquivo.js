class Arquivo {
    constructor(nome, conteudo = '') {
        this.nome = nome;
        this.conteudo = conteudo;
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

    getStats() {
        return {
            nome: this.nome,
            size: this.conteudo.length,
            lines: this.conteudo.split('\n').length
        };
    }
}

export default Arquivo;

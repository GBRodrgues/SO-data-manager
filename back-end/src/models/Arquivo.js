class Arquivo {
    constructor(nome, conteudo = '') {
        this.nome = nome;
        this.conteudo = conteudo;
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

module.exports = Arquivo;

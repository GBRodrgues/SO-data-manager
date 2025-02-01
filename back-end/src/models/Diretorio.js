class Diretorio {
    constructor(nome) {
        this.nome = nome;
        this.arquivos = [];
        this.subpastas = [];
    }

    addArquivo(arquivo) {
        this.arquivos.push(arquivo);
    }

    addSubPasta(subpasta) {
        this.subpastas.push(subpasta);
    }

    removeArquivo(arquivonome) {
        this.arquivos = this.arquivos.filter(arquivo => arquivo.nome !== arquivonome);
    }

    removeSubPasta(nomePasta) {
        this.subpastas = this.subpastas.filter(pasta => pasta.nome !== nomePasta);
    }

    listContents() {
        return {
            arquivos: this.arquivos.map(f => f.nome),
            subpastas: this.subpastas.map(d => d.nome)
        };
    }
}

export default Diretorio;

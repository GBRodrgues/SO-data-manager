import Arquivo from "./Arquivo.js";
class Diretorio {


    constructor(nome, pai) {
        this.nome = nome;
        this.arquivos = [];
        this.subpastas = [];
        this.data_modificacao = Date.now();
        this.diretorioPai = pai;
    }

    static setupRoot(){
        var rootDir = new Diretorio('~', null);
        let hello_world = new Arquivo('hello_world.txt','Olá\nArquivo de testes!');
        rootDir.addArquivo(hello_world);
        let usr = new Diretorio('usr', rootDir);
        rootDir.addSubPasta(usr);
        return rootDir;
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

    updateNome(nome){
        this.nome = nome;
    }

    getDiretorioPai(){
        return this.diretorioPai;
    }

    listContents() {
        return {
            arquivos: this.arquivos.map(f => f.nome),
            subpastas: this.subpastas.map(d => d.nome)
        };
    }

    printWorkDirectory(){
        if(this.nome == '~'){
            return this.nome;
        }
        return this.diretorioPai.printWorkDirectory() + '/' + this.nome
    }
}

export default Diretorio;

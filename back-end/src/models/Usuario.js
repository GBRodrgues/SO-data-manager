import Diretorio from "./Diretorio.js";

class Usuario {
    constructor(nome, id){
        this.nome = nome;
        const nome_pasta = nome.split(" ").join(".").toLowerCase();
        this.pasta_usuario = new Diretorio(nome_pasta);
        this.id = id;
    }
    mudaNome(novoNome){
        this.nome = novoNome;
        return 'nome alterado com sucesso';
    }

    getPastaUsuario(pai){
        this.pasta_usuario.diretorioPai = pai;
        return this.pasta_usuario;
    }

    getInfo(){
        let result = `Nome: ${this.nome}\nID: ${this.id}`;
        return result;
    }
}

export default Usuario;

import Diretorio from "../../models/Diretorio.js";
import fileServices from "./fileServices.js";
import searchServices from "./searchServices.js";
const dirServices = {

    createDirectory: (name, dir = Diretorio) => {
        // Recebe a pasta onde o novo diretório será criado e o nome desse novo diretório
        if (!name) {
            return { success: false, message: "Nome obrigatório." };
        }

        const dirExists = searchServices.findDir(dir, name);
        if (dirExists) {
            return { success: false, message: `O diretório '${name}' já existe` };
        }

        const newDir = new Diretorio(name, dir);
        dir.addSubPasta(newDir);
        return {
            success: true,
            message: `Diretório '${name}' criado com sucesso.`,
        };
    },

    removeDirectory: (name, dir = Diretorio) => {
        if (!name) {
            return { success: false, message: "Nome obrigatório." };
        }

        const dirFound = searchServices.findDir(dir, name);
        if (!dirFound) {
            return { success: false, message: `Diretório '${name}' não existe.` };
        }

        dir.removeSubPasta(name);
        return { success: true, message: `Diretório '${name}' removido` };
    },

    showTree: (dir = Diretorio) => {
        var root = dir.get_root();
        //incializa a resposta com o nome da pasta raiz
        let result = root.nome;

        const printTree = (dir, prefix = "", string_final) => {
            //funcao para criar arvore
            const subpastas = dir.subpastas;
            const arquivos = dir.arquivos;
            const total = subpastas.length + arquivos.length;

            subpastas.forEach((pasta, index) => {
                //para cada pasta do diretorio
                const isLast = index === total - 1; //se o indice for o último da pasta
                string_final = string_final.concat(
                    prefix + (isLast ? "└── " : "├── ") + pasta.nome + "\n"
                ); //exibe o nome da subpasta
                string_final = printTree(
                    pasta,
                    prefix + (isLast ? "    " : "│   "),
                    string_final
                ); //recursivamente, exibe o conteudo da subpasta
            });

            arquivos.forEach((arquivo, index) => {
                const isLast = index === arquivos.length - 1; //verifica se é o último arquivo da pasta
                string_final = string_final.concat(
                    prefix + (isLast ? "└── " : "├── ") + arquivo.nome + "\n"
                ); //exibe o arquivo
            });
            return string_final;
        };

        result = printTree(root, "", result + "\n");
        return { success: true, message: result };
    },

    rename: (nomes, dir = Diretorio) => {
        let vetor_nomes = nomes.split(" ");
        let nome_antigo = vetor_nomes[0];
        let nome_novo = vetor_nomes[1];
        let arquivo = searchServices.findArq(dir, nome_antigo);
        let dirFound = searchServices.findDir(dir, nome_antigo);

        if (arquivo) {
            arquivo.at(0).atualizarNome(nome_novo);
            return {
                success: true,
                message: `Nome do arquivo alterado de "${nome_antigo}" para "${nome_novo}"`,
            };
        }
        if (dirFound) {
            dirFound.at(0).atualizarNome(nome_novo);
            return {
                success: true,
                message: `Nome do diretorio alterado de "${nome_antigo}" para "${nome_novo}"`,
            };
        }

        return {
            success: false,
            message: `Arquivo ou diretório "${nome_antigo}" não encontrado.`,
        };
    }
}
export default dirServices;
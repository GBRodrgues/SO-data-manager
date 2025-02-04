import Diretorio from '../models/Diretorio.js';
import Arquivo from '../models/Arquivo.js';

const comandoService = {
    // Inicializando um diretório raiz para simular um sistema de arquivos
    root: new Diretorio('root'),
    currentDirectory: 'root',  // Diretório inicial é o 'root'
    currentPath: 'root',
    execute: (command, args) => {
        console.log(`[LOG] Executando comando: ${command}`, args);
        console.log(command + ' ' + args.name)

        switch (command) {
            case 'mkdir':
                return comandoService.createDirectory(args.name); 
            case 'rmdir':
                return comandoService.removeDirectory(args.name); 
            case 'touch':
                return comandoService.createFile(args.name); 
            case 'ls':
                return comandoService.listContents(); 
            case 'cd':
                return comandoService.changeDirectory(args.name); 
            case 'pwd':
                return comandoService.printWorkingDirectory(); 
            case 'stat':
                return comandoService.getFileStats(args.name); 
            case 'cat':
                return comandoService.showFileContent(args.name);
            case 'rm':
                return comandoService.remove(args.name);
            default:
                return { success: false, message: 'Comando inválido!' };
        }
    },

    createDirectory: (name) => {
        if (!name) {
            return { success: false, message: 'Nome obrigatório.' };
        }
        
        const dirExists = comandoService.findDirectory(name); 
        if (dirExists) {
            return { success: false, message: `O diretório '${name}' já existe` };
        }

        const newDir = new Diretorio(name);
        comandoService.root.addSubPasta(newDir); 
        return { success: true, message: `Diretório '${name}' criado com sucesso.` };
    },

    removeDirectory: (name) => {
        if (!name) {
            return { success: false, message: 'Nome obrigatório.' };
        }

        const dir = comandoService.findDirectory(name); 
        if (!dir) {
            return { success: false, message: `Diretório '${name}' não existe.` };
        }

        comandoService.root.removeSubPasta(name); 
        return { success: true, message: `Diretório '${name}' removido` };
    },

    createFile: (name) => {
        if (!name) {
            return { success: false, message: 'Nome do arquivo obrigatório.' };
        }

        const file = new Arquivo(name);
        comandoService.root.addArquivo(file); 
        return { success: true, message: `Arquivo '${name}' criado` };
    },

    listContents: () => {
        const contents = comandoService.root.listContents(); 
        if(contents.arquivos.length == 0 && contents.subpastas.length == 0){
            return { success: false, message: 'Diretório vazio.'};
        }
        var conteudos = [];
        conteudos = contents.arquivos.concat(contents.subpastas);
        return { success: true, message: conteudos.join('\n')}
    },

    changeDirectory: (path) => {
        // Verifica se o caminho é válido, ou seja, se o diretório existe como subpasta do diretório atual
        const dirExists = comandoService.findDirectory(path);
        if (!dirExists) {
            return { success: false, message: `Diretório '${path}' não encontrado.` };
        }

        // Muda o diretório atual
        comandoService.root = dirExists;
        comandoService.currentPath = comandoService.currentPath.concat('/'.concat(path))
        return { success: true, message: `Diretório alterado para '${path}'` };
    },

    printWorkingDirectory: () => {
        return { success: true, message: comandoService.currentPath};
    },

    getFileStats: (name) => {
        if (!name) {
            return { success: false, message: 'Nome do arquivo obrigatório.' };
        }

        const file = comandoService.root.arquivos.find(f => f.nome === name); 
        if (!file) {
            return { success: false, message: `Arquivo '${name}' não existe` };
        }
        const stats = file.getStats();
        return { success: true, stats };
    },

    findDirectory: (name) => {
        // Verifica se o diretório existe em subpastas do diretório atual
        return comandoService.root.subpastas.find(pasta => pasta.nome === name); 
    },

    findArquivo: (name) => {
        return comandoService.root.arquivos.find(arquivo => arquivo.nome === name);
    },

    showFileContent: (name) => {
        const arquivo = comandoService.findArquivo(name);
        if(!arquivo){
            return {success : false, message: 'Arquivo não existe.'}
        }
        return {success: true, message: arquivo.read()};
    },

    remove: (name) => {
        const arquivo = comandoService.findArquivo(name);
        const subpasta = comandoService.findDirectory(name);

        console.log(arquivo);
        console.log(subpasta);

        if(!arquivo && !subpasta){
            return{success: false, message: "Nenhum arquivo ou subasta encontrada com esse nome."}
        }
        if(subpasta){
            comandoService.root.removeSubPasta(name);
            return{success: true, message: `Pasta '${name}' removida com sucesso!`};
        }
        comandoService.root.removeArquivo(name);
        return{success: true, message: `Arquivo '${name}' removido com sucesso!`};

    },
};

export default comandoService;

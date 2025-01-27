const Diretorio = require('../src/models/Diretorio');
const Arquivo = require('../src/models/Arquivo');

describe('Modelo Diretorio', () => {
    let dir;

    beforeEach(() => {
        dir = new Diretorio('TestDir');
    });

    test('Deve criar um novo repositorio', () => {
        expect(dir.nome).toBe('TestDir');
        expect(dir.arquivos).toEqual([]);
        expect(dir.subpastas).toEqual([]);
    });

    test('Deve adicionar e remover arquivos', () => {
        const file = new Arquivo('test.txt', 'Hello World');
        dir.addArquivo(file);

        expect(dir.arquivos.length).toBe(1);
        expect(dir.arquivos[0].nome).toBe('test.txt');

        dir.removeArquivo('test.txt');
        expect(dir.arquivos.length).toBe(0);
    });

    test('Deve adicionar e remover subpastas', () => {
        const subp = new Diretorio('Subpasta');
        dir.addSubPasta(subp);

        expect(dir.subpastas.length).toBe(1);
        expect(dir.subpastas[0].nome).toBe('Subpasta');

        dir.removeSubPasta('Subpasta');
        expect(dir.subpastas.length).toBe(0);
    });

    test('Deve listar o conteudo', () => {
        dir.addArquivo(new Arquivo('file1.txt'));
        dir.addSubPasta(new Diretorio('subdir1'));

        const contents = dir.listContents();
        expect(contents.arquivos).toEqual(['file1.txt']);
        expect(contents.subpastas).toEqual(['subdir1']);
    });
});

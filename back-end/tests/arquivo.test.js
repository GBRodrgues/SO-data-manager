const Arquivo = require('../src/models/Arquivo');

describe('Modelo Arquivo', () => {
    let arquivo;

    beforeEach(() => {
        arquivo = new Arquivo('test.txt', 'Conteudo inicial');
    });

    test('Deve criar um arquivo com nome e conteudo', () => {
        expect(arquivo.nome).toBe('test.txt');
        expect(arquivo.conteudo).toBe('Conteudo inicial');
    });

    test('Deve sobreescrever o conteudo do arquivo', () => {
        arquivo.write('Novo Conteudo');
        expect(arquivo.conteudo).toBe('Novo Conteudo');
    });

    test('deve dar um append no conteudo do arquivo', () => {
        arquivo.append('Conteudo addicionado');
        expect(arquivo.conteudo).toBe('Conteudo inicial\nConteudo addicionado');
    });

    test('should return Arquivo stats', () => {
        const stats = arquivo.getStats();
        expect(stats.nome).toBe('test.txt');
        expect(stats.size).toBe(arquivo.conteudo.length);
        expect(stats.lines).toBe(1);
    });
});

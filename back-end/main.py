comandos_exemplo = [
    # Criação e Manipulação de Diretórios
    "mkdir <nome>",       # Criar um novo diretório
    "rmdir <nome>",       # Remover um diretório vazio
    "tree",               # Mostrar a estrutura hierárquica de arquivos e diretórios
    "rename <nome_antigo> <novo_nome>",  # Renomear um arquivo ou diretório

    # Criação e Manipulação de Arquivos
    "touch <nome>",         # Criar um arquivo vazio
    "echo <texto> > <arquivo>",  # Sobrescrever conteúdo de um arquivo
    "echo <texto> >> <arquivo>", # Adicionar texto ao final do conteúdo existente
    "cat <arquivo>",        # Mostrar o conteúdo de um arquivo
    "rm <nome>",            # Remover um arquivo ou diretório (mesmo que não esteja vazio)
    "head <arquivo> <n>",   # Exibir as primeiras `n` linhas do arquivo
    "tail <arquivo> <n>",   # Exibir as últimas `n` linhas do arquivo
    "wc <arquivo>",         # Mostrar número de linhas, palavras e caracteres de um arquivo

    # Navegação entre Diretórios
    "cd <nome>",  # Navegar para um diretório específico
    "cd ..",      # Voltar ao diretório anterior
    "cd /",       # Ir para o diretório raiz
    "pwd",        # Exibir o caminho completo do diretório atual

    # Busca e Filtragem
    "find <diretorio> -name <nome>",  # Procurar arquivos/diretórios pelo nome
    "grep <termo> <arquivo>",         # Procurar palavra/frase dentro de um arquivo

    # Permissões e Propriedades (Simuladas)
    "chmod <permissao> <nome>",  # Alterar permissões de um arquivo/diretório
    "chown <proprietario> <nome>",  # Alterar proprietário de um arquivo/diretório
    "ls -l",  # Listar conteúdo do diretório com detalhes

    # Informações sobre Arquivos e Diretórios
    "stat <nome>",  # Exibir informações detalhadas de um arquivo/diretório
    "du <diretorio>",  # Exibir tamanho do diretório em bytes

    # Operações Avançadas
    "cp <origem> <destino>",  # Copiar arquivos ou diretórios
    "mv <origem> <destino>",  # Mover arquivos ou diretórios
    "diff <arquivo1> <arquivo2>",  # Comparar dois arquivos
    "zip <arquivo.zip> <itens>",  # Compactar arquivos/diretórios em `.zip` (simulado)
    "unzip <arquivo.zip>",  # Descompactar um arquivo `.zip`

    # Extras
    "history"  # Exibir os últimos comandos digitados
]

comandos = []
for comando in comandos_exemplo:
    texto_comando = str(comando).split(sep=" ")[0]
    comandos.append(texto_comando)
    print(comando)
    
print("======================\n")


sair = False
while(not sair):
    entrada = input("Qual comando quer executar?\n")
    if entrada not in comandos:
        print("Comando inexsitente")
        sair = True
        break
    
    print(f"Você escolheu o comando {entrada}\n")
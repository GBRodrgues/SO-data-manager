# S.0. Data Manager

Sistema que simulará um Sistema Operacional, focando nas áreas de manipulação de repositórios e arquivos.
___

## Front End
Opções de frameworks para facilitar o desenvolvimento:
- [PyWebView](https://pywebview.flowrl.com/)
- [Dear PyGui](https://dearpygui.readthedocs.io/en/latest/)
<br>
___

## Back End
### Requisitos

[python3.12.3](https://www.python.org/downloads/release/python-3123/)
[Guia iniciação Python](https://github.com/arbackes/Livro_Python/blob/main/Aprendendo%20Python%20-%20um%20guia%20b%C3%A1sico%20de%20programa%C3%A7%C3%A3o.pdf)

### Instalando Ambiente Virtual Python
No repositório do projeto back-end:
```python3 -m pip install venv```

Agora crie o ambiente virtual
```python3 -m venv venv```

Ative o ambiente virtual
- windows
  ```venv/scripts/activate```
- linux
```source venv/bin/activate ```

Ao finalizar as suas 'codagens', desative com o comando ```deactivate```

### Instalando as bibliotecas do Python
Com o ambiente virtual ativado, como explicado no passo anterior, instale as dependências:
```pip install -r requirements.txt```

### Executando o projeto
```python main.py```
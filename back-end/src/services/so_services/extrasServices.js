import Diretorio from "../../models/Diretorio.js";
import Usuario from "../../models/Usuario.js";

import fs from "fs";
import path from "path";
import searchServices from "./searchServices.js";

const extraServices = {

  listContents: (dir=Diretorio) => {
    const contents = dir.listContents();
    if (contents.arquivos.length == 0 && contents.subpastas.length == 0) {
      return { success: false, message: "Diretório vazio." };
    }
    var conteudos = [];
    conteudos = contents.arquivos.concat(contents.subpastas);
    return { success: true, message: conteudos.join("\n") };
  },



  //adicionando um novo usuário na pasta usr
  adduser: (username, dir=Diretorio) => {
    const pastaUsuarios = dir
      .get_root()
      .subpastas.find((pasta) => pasta.nome === "usuarios");
    const n_usuarios = pastaUsuarios.subpastas.length;
    const usuario = new Usuario(username, n_usuarios + 1);

    const subpasta_usuario = usuario.getPastaUsuario(pastaUsuarios);
    const arquivo_usuario = new Arquivo(
      subpasta_usuario.nome + ".txt",
      usuario.getInfo()
    );
    subpasta_usuario.addArquivo(arquivo_usuario);
    pastaUsuarios.addSubPasta(subpasta_usuario);
    return { success: true, message: "usuario criado com sucesso" };
  },

  save: (dir=Diretorio) => {
    let caminhoBase = "./sistema_arquivos";
    if (!fs.existsSync(caminhoBase)) {
      fs.mkdirSync(caminhoBase, { recursive: true });
    }

    function criarDiretorio(diretorio, caminhoAtual) {
      const caminhoDiretorio = path.join(caminhoAtual, diretorio.nome);

      if (!fs.existsSync(caminhoDiretorio)) {
        fs.mkdirSync(caminhoDiretorio, { recursive: true });
      }

      // Criar arquivos no diretório
      diretorio.arquivos.forEach((arquivo) => {
        const caminhoArquivo = path.join(caminhoDiretorio, arquivo.nome);
        fs.writeFileSync(caminhoArquivo, arquivo.conteudo);
      });

      // Criar subdiretórios recursivamente
      diretorio.subpastas.forEach((subpasta) => {
        criarDiretorio(subpasta, caminhoDiretorio);
      });
    }

    criarDiretorio(dir.get_root(), caminhoBase);

    return {
      success: true,
      message: "Arquivos salvos com sucesso localmente.",
    };
  },

  chown: (args, dir=Diretorio) => {
    let args_arr = args.split(" ");
    let dirname = args_arr.pop();
    let username = args_arr.join(" ");

    const pastaUsuarios = dir
      .get_root()
      .subpastas.find((pasta) => pasta.nome === "usuarios").subpastas;
    let userFound = false;
    var count = 0;
    let usr = null;
    while (!userFound) {
      if (pastaUsuarios.length <= count) {
        return { success: false, message: "Usuário não encontrado" };
      }
      let handle_usr = pastaUsuarios.at(count);
      let arq_usr = handle_usr.arquivos.find(
        (arquivo) => arquivo.nome === handle_usr.nome + ".txt"
      );
      let name_arr = arq_usr.conteudo.split("\n").at(0).split(" ");
      name_arr.shift();
      let nome_usr = name_arr.join(" ");
      let id_usr = arq_usr.conteudo.split("\n").at(1).split(" ").at(1);
      count++;
      userFound = true ? nome_usr == username : false;
      usr = new Usuario(nome_usr, id_usr);
      console.log(usr);
    }

    const dirFound = searchServices.findDir(dir, dirname).at(0);
    if (dirFound instanceof Diretorio) {
      dirFound.mudarProprietario(usr);
      return {
        success: true,
        message: "Proprietário do diretório alterado com sucesso",
      };
    } else {
      const arq = searchServices.findArq(dir, dirname).at(0);
      if (arq instanceof Arquivo) {
        arq.mudarProprietario(usr);
        return {
          success: true,
          message: "Proprietário do arquivo alterado com sucesso",
        };
      }
      return { success: false, message: "Diretorio ou arquivo não encontrado" };
    }
  },
}
export default extraServices;
export function validarRegistro(email: string, usuario:string, senha:string, confSenha:string){
    const Erros = {
        email: (!email.includes("@") || !email),
        usuario: !usuario,
        senha: (senha.length < 6 || !senha),
        confSenha: (senha !== confSenha || !confSenha)
    }
    return Erros
}
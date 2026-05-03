export function validateRegister(email: string, user:string, password:string, confPassword:string){
    const Errors = {
        email: (!email.includes("@") || !email),
        user: !user,
        password: (password.length < 4 || !password),
        confPassword: (password !== confPassword || !confPassword)
    }
    return Errors
}
export function validateRegister(email: string, user:string, password:string, confPassword:string){
    const Errors = {
        email: !email.includes("@"),
        user: !user,
        password: password.length < 4,
        confPassword: !(password === confPassword)
    }
    return Errors
}
export interface sellerRegister
{
    name:string,
    email:string,
    password:string,
    address:string,
    phoneNumber:number,
}

export interface sellerLogin
{
    email:string,
    password:string
}
export interface sellerLoginUpdate
{
    email:string,
    password:string,
    newpassword:string,
}
export interface updateSeller
{id:any,
name?:string,
address?:string,
phoneNumber?:number,
}
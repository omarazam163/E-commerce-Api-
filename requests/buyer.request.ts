export interface buyerRegister
{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    address:string,
    phoneNumber:number,
    image?:string
}
export interface buyerLogin
{
    email:string,
    password:string
}
export interface buyerLoginUpdate
{
    email:string,
    password:string,
    newpassword:string,
}
export interface updateBuyer
{id:any,
firstName?:string,
lastName?:string,
phoneNumber?:number,
}

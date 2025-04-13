
import {IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {


    @IsNotEmpty({message:'O email não pode ser vazio'})
    @IsEmail(undefined,{message: 'Email inválido'})
    email: string;

    @IsNotEmpty({message:'A senha deve ser informada'})
    password: string;

}

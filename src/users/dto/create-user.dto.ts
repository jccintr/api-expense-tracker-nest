
import {IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {


    @IsNotEmpty({message:'O nome não pode ser vazio'})
    @IsString({message:'O nome deve ser uma string'})
    name: string;

    @IsEmail(undefined,{message: 'Email inválido'})
    email: string;

    @IsNotEmpty({message:'A senha deve ser informada'})
    password: string;

}

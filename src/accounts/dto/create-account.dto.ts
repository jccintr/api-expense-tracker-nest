import { IsString,IsNotEmpty } from "class-validator";
import { User } from "generated/prisma";

export class CreateAccountDto {

      @IsNotEmpty({message:'O nome não pode ser vazio'})
      @IsString({message:'O nome deve ser uma string'})
      name: string;
    
}

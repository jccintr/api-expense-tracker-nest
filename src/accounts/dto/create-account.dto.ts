import { IsString,IsNotEmpty } from "class-validator";


export class CreateAccountDto {

      @IsNotEmpty({message:'O nome não pode ser vazio'})
      @IsString({message:'O nome deve ser uma string'})
      name: string;
    
}

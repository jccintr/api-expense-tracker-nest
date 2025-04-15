import {IsNotEmpty,IsNumber,IsPositive,IsInt } from 'class-validator';

export class CreateTransactionDto {

    
    @IsNotEmpty({message:'A descrição não pode ser vazia'})
    description: string;

    @IsNumber()
    @IsPositive()
    amount: number;

    @IsInt()
    accountId: number;

    @IsInt()
    categoryId: number;

    

}

import { Injectable,NotFoundException,ForbiddenException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TransactionsService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createTransactionDto: CreateTransactionDto,userId: number) {
    const { description,amount, accountId, categoryId } = createTransactionDto;
    return await this.databaseService.transaction.create({
      data: {
        description,
        amount,
        user: { connect: { id: userId, }, },
        account: { connect: { id: accountId } },
        category: { connect: { id: categoryId } },
      },
    });
  }

  async findAll(userId: number) {
    return await this.databaseService.transaction.findMany({where:{userId},include:{account:{select:{id:true,name:true}},category:{select:{id:true,name:true}}}});
  }

  async findOne(id: number,userId:number) {
   const transaction = await this.databaseService.transaction.findUnique({where:{id},select:{id:true,description:true,amount:true,userId:true,createdAt:true,updatedAt:true,account:{select:{id:true,name:true}},category:{select:{id:true,name:true}}},});
   
       if (!transaction) throw new NotFoundException(`Ressource not found. ID ${id}`);
   
       if(transaction.userId !== userId) throw new ForbiddenException();
       
       return transaction
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto,userId:number) {

    const transaction = await this.databaseService.transaction.findUnique({where:{id}});

    if (!transaction) throw new NotFoundException(`Ressource not found. ID ${id}`);

    if(transaction.userId !== userId) throw new ForbiddenException();

    const updatedTransaction = await this.databaseService.transaction.update({where:{id},data:updateTransactionDto});
    return updatedTransaction
  }

  async remove(id: number,userId:number) {
    const transaction = await this.databaseService.transaction.findUnique({where:{id}});

    if (!transaction) throw new NotFoundException(`Ressource not found. ID ${id}`);

    if(transaction.userId !== userId) throw new ForbiddenException();

    await this.databaseService.transaction.delete({where:{id}});

    return {status:'sucesso'}
  }
}

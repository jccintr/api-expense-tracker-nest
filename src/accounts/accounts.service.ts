import { ForbiddenException, Injectable,NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class AccountsService {

  constructor(private readonly databaseService: DatabaseService) {}
  
  async create(createAccountDto: CreateAccountDto,userId: number) {
   
    return await this.databaseService.account.create({
      data: {
        ...createAccountDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId:number) {
    return await this.databaseService.account.findMany({where:{userId}});
  }

  async findOne(id: number,userId:number) {

    const account = await this.databaseService.account.findUnique({where:{id},select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true}});

    if (!account) throw new NotFoundException(`Ressource not found. ID ${id}`);

    if(account.userId !== userId) throw new ForbiddenException();
    
    return account
  }

  async update(id: number, updateAccountDto: UpdateAccountDto,userId:number) {

    const account = await this.databaseService.account.findUnique({where:{id}});

    if (!account) throw new NotFoundException(`Ressource not found. ID ${id}`);

    if(account.userId !== userId) throw new ForbiddenException();

    const updatedAccount = await this.databaseService.account.update({where:{id},data:updateAccountDto});
    return updatedAccount

  }

  async remove(id: number,userId:number) {

    const account = await this.databaseService.account.findUnique({where:{id}});

    if (!account) throw new NotFoundException(`Ressource not found. ID ${id}`);

    if(account.userId !== userId) throw new ForbiddenException();

    await this.databaseService.account.delete({where:{id}});

 
    return { message: `Conta ${id} removida com sucesso.` };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {

  constructor(private readonly databaseService: DatabaseService) {

  }

  async create(createUserDto: CreateUserDto) {
    
    const existingUser = await this.databaseService.user.findUnique({ where: { email: createUserDto.email } });

    if (existingUser) throw new BadRequestException('Email já cadastrado');

    
    const salt = await bcrypt.genSalt();
   
    createUserDto.password = await bcrypt.hash(createUserDto.password,salt);
    // exclui a senha do retorno
    const { password, ...result } =  await this.databaseService.user.create({data: createUserDto});
    return result;

  }

  /*
  findAll() {
    return `This action returns all users`;
  }
*/
  async findAllPaginated(page: number = 1, size: number = 10) {
   
    const skip = (page - 1) * size;
    
  
    const [data, total] = await Promise.all([
      this.databaseService.user.findMany({
        skip,
        take: size,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc', // ou 'desc' para ordem decrescente
        },
      }),
      this.databaseService.user.count(),
    ]);
  
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / size),
    };
  }


  async findByEmail(email: string){
    return await this.databaseService.user.findUnique({ where: { email } });
  }

 async findOne(id: number) {
    const user = await this.databaseService.user.findUnique({where:{id}, select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },});

    if (!user) throw new NotFoundException(`Ressource not found. ID ${id}`);
    
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.databaseService.user.findUnique({ where: { id } });
  
    if (!existingUser) throw new NotFoundException(`Ressource not found. ID ${id}`);
  
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
  
    const { password, ...result } = await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  
    return result;
  }
  

  async remove(id: number) {
    const existingUser = await this.databaseService.user.findUnique({ where: { id } });
  
    if (!existingUser) throw new NotFoundException(`Ressource not found. ID ${id}`);
  
    await this.databaseService.user.delete({ where: { id } });
  
    return { message: `Usuário ${id} removido com sucesso.` };
  }
  


 
}

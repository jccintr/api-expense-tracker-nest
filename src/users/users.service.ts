import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all users`;
  }

  async findByEmail(email: string){
    return await this.databaseService.user.findUnique({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import { Injectable,NotFoundException,ForbiddenException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesService {

  constructor(private readonly databaseService: DatabaseService) {}


  async create(createCategoryDto: CreateCategoryDto,userId: number) {

    return await this.databaseService.category.create({
      data: {
        ...createCategoryDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

   
  }

  async findAll(userId:number) {
    return await this.databaseService.category.findMany({where:{userId}});
  }

 async findOne(id: number,userId:number) {
 
     const category = await this.databaseService.category.findUnique({where:{id},select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true}});
 
     if (!category) throw new NotFoundException(`Ressource not found. ID ${id}`);
 
     if(category.userId !== userId) throw new ForbiddenException();
     
     return category
   }

  async update(id: number, updateCategoryDto: UpdateCategoryDto,userId:number) {

    const category = await this.databaseService.category.findUnique({where:{id}});

    if (!category) throw new NotFoundException(`Ressource not found. ID ${id}`);

    if(category.userId !== userId) throw new ForbiddenException();

    const updatedCategory = await this.databaseService.category.update({where:{id},data:updateCategoryDto});
    return updatedCategory

  }

  async remove(id: number,userId:number) {

    const category = await this.databaseService.category.findUnique({where:{id}});

    if (!category) throw new NotFoundException(`Ressource not found. ID ${id}`);

    if(category.userId !== userId) throw new ForbiddenException();

    await this.databaseService.category.delete({where:{id}});

    return {status:'sucesso'}
  }
}

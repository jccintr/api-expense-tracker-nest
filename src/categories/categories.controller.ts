import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, ValidationPipe,Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto,@Request() req) {
    return this.categoriesService.create(createCategoryDto,req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
      return this.categoriesService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Request() req) {
    return this.categoriesService.findOne(+id,req.user.id);
  }

  @UseGuards(AuthGuard)
   @Patch(':id')
   update(@Param('id') id: string, @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,@Request() req) {
     return this.categoriesService.update(+id, updateCategoryDto,req.user.id);
   }

   @UseGuards(AuthGuard)
   @Delete(':id')
   remove(@Param('id') id: string,@Request() req) {
     return this.categoriesService.remove(+id,req.user.id);
   }
}

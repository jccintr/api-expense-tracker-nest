import { Controller, Get, Post, Body, Patch, Param, Delete,Request,UseGuards, ValidationPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body(ValidationPipe) createAccountDto: CreateAccountDto,@Request() req) {
  
    return this.accountsService.create(createAccountDto,req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
  
    return this.accountsService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Request() req) {
    return this.accountsService.findOne(+id,req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateAccountDto: UpdateAccountDto,@Request() req) {
    return this.accountsService.update(+id, updateAccountDto,req.user.id);
  }
  
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.accountsService.remove(+id,req.user.id);
  }
}

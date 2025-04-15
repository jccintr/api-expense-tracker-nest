import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, ValidationPipe,Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body(ValidationPipe) createTransactionDto: CreateTransactionDto,@Request() req) {
    return this.transactionsService.create(createTransactionDto,req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.transactionsService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string,@Request() req) {
    return this.transactionsService.findOne(+id,req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto,@Request() req) {
    return this.transactionsService.update(+id, updateTransactionDto,req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string,@Request() req) {
    return this.transactionsService.remove(+id,req.user.id);
  }
}

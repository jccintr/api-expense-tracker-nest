import { Module,forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[DatabaseModule,forwardRef(() => AuthModule)],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports:[TransactionsService],
})
export class TransactionsModule {}

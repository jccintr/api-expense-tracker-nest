import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef } from '@nestjs/common';

@Module({
   imports:[DatabaseModule,forwardRef(() => AuthModule)],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports:[AccountsService],
})
export class AccountsModule {}

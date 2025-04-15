import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule,ConfigModule.forRoot({
    isGlobal: true, // Torna o módulo disponível globalmente
  }), AccountsModule, CategoriesModule, TransactionsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { Post,Body } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

   @Post('signup')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    
    return this.authService.signUp(createUserDto);
  
  }

    
}

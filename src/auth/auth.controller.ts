import { Controller,Post,Body,HttpCode,ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

   @Post('signup')
   create(@Body(ValidationPipe) createUserDto: CreateUserDto) {

    return this.authService.signUp(createUserDto);
  
  }

  @Post('signin')
  @HttpCode(200)
  login(@Body(ValidationPipe) loginDto: LoginDto){
      return this.authService.signIn(loginDto);
  }

    
}

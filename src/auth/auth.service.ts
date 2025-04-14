import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,private usersService:UsersService) {}
    //constructor(private usersService:UsersService) {}

    async signUp(createUserDto: CreateUserDto){

        return this.usersService.create(createUserDto);

    }


    async signIn(loginDto: LoginDto){

        const user = await this.usersService.findByEmail(loginDto.email);

        if(!user){
            throw new UnauthorizedException();
        }

        const isMatch = await bcrypt.compare(loginDto.password,user.password);

        if(!isMatch){
            throw new UnauthorizedException();
        }

       const payload = { sub: user.id, name: user.name, email: user.email };

       return {access_token: await this.jwtService.signAsync(payload)};
    
    }
}

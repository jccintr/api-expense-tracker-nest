import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(private usersService:UsersService) {}

    async signUp(createUserDto: CreateUserDto){
        
        return this.usersService.create(createUserDto);
    }
}

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;


  var mockUsersService: {
    create: jest.Mock,
    findAllPaginated: jest.Mock,
    findOne: jest.Mock,
    update: jest.Mock,
    remove: jest.Mock,
  };

  

  // Mock simples para AuthGuard
  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(dto => ({ id: 1, ...dto })),
      findAllPaginated: jest.fn(() => ({
        data: [],
        total: 0,
        page: 1,
        lastPage: 1,
      })),
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com' }),
      update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated', email: 'test@example.com' }),
      remove: jest.fn().mockResolvedValue({ message: 'Usuário removido com sucesso' }),
    };
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  


  describe('create', () => {
      it('deve criar um usuário', async () => {
        const dto: CreateUserDto = { name: 'John', email: 'john@example.com', password: '123456' };
        expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
        expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      });
  });

  describe('findAllPaginated', () => {
        it('deve retornar todos os usuários paginados', async () => {
          expect(await controller.findAll(1, 10)).toEqual({
            data: [],
            total: 0,
            page: 1,
            lastPage: 1,
          });
        });
   });


  describe('findOne', () => {
        it('deve retornar um usuário se o id existir', async () => {
          const result = await controller.findOne('1');
          expect(result).toEqual({ id: 1, name: 'Test', email: 'test@example.com' });
        });

        it('deve lançar NotFoundException se o id não existir', async () => {
          const id = 999;
          jest.spyOn(mockUsersService, 'findOne').mockRejectedValue(new NotFoundException(`Ressource not found. ID ${id}`));
        
          await expect(controller.findOne(id.toString())).rejects.toThrow(NotFoundException);
          expect(mockUsersService.findOne).toHaveBeenCalledWith(id);
        });
  });


  describe('update', () => {
      it('deve atualizar um usuário se o id existir', async () => {
        const dto: UpdateUserDto = { name: 'Updated Name' };
        expect(await controller.update('1', dto)).toEqual({ id: 1, name: 'Updated', email: 'test@example.com' });
      });

      it('deve lançar NotFoundException se o id não existir', async () => {
        const id = 1; 
        const dto = { name: 'Updated' };
      
        jest.spyOn(mockUsersService, 'update').mockRejectedValue(new NotFoundException(`Ressource not found. ID ${id}`));
      
        await expect(controller.update(id.toString(), dto)).rejects.toThrow(NotFoundException);
        expect(mockUsersService.update).toHaveBeenCalledWith(id, dto);
      });
  });



  describe('remove', () => {
        it('deve remover um usuário se o id existir', async () => {
          expect(await controller.remove('1')).toEqual({ message: 'Usuário removido com sucesso' });
        });
        it('deve lançar NotFoundException se o id não existir', async () => {
          const id = 1; 
        
        
          jest.spyOn(mockUsersService, 'remove').mockRejectedValue(new NotFoundException(`Ressource not found. ID ${id}`));
        
          await expect(controller.remove(id.toString())).rejects.toThrow(NotFoundException);
          expect(mockUsersService.remove).toHaveBeenCalledWith(id,);
        });
   });

 


});

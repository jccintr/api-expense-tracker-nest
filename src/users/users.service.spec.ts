import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/database/database.service';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';




describe('UsersService', () => {
  let service: UsersService;

  const mockDatabaseService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
     providers: [UsersService,
      {
        provide: DatabaseService,
        useValue: mockDatabaseService,
      },
     ],
     
    
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('create()', () => {

      it('deve criar um novo usuário se o email não estiver cadastrado', async () => {
        const dto = { name: 'Julio', email: 'julio@email.com', password: '123456' };
        mockDatabaseService.user.findUnique.mockResolvedValue(null);
        mockDatabaseService.user.create.mockImplementation(({ data }) => ({
          id: 1,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        const result = await service.create({ ...dto });

        expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
        expect(mockDatabaseService.user.create).toHaveBeenCalled();
        expect(result).toHaveProperty('id');
        expect(result).not.toHaveProperty('password');
      });

      it('deve lançar exceção se o email já estiver cadastrado', async () => {

        const dto = { name: 'Julio', email: 'julio@email.com', password: '123456' };
        mockDatabaseService.user.findUnique.mockResolvedValue({ id: 1, ...dto });

        await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      });

});


  describe('findAllPaginated()', () => {

        it('deve retornar usuários paginados com total e lastPage corretos', async () => {
          const mockUsers = [
            { id: 1, name: 'Julio', email: 'julio@email.com', createdAt: new Date(), updatedAt: new Date() },
            { id: 2, name: 'Carlos', email: 'carlos@email.com', createdAt: new Date(), updatedAt: new Date() },
          ];
          
          mockDatabaseService.user.findMany = jest.fn().mockResolvedValue(mockUsers);
          mockDatabaseService.user.count = jest.fn().mockResolvedValue(12); // simulando total 12 usuários no banco
      
          const result = await service.findAllPaginated(2, 2); // page 2, size 2
      
          expect(mockDatabaseService.user.findMany).toHaveBeenCalledWith({
            skip: 2, // (page - 1) * size => (2 - 1) * 2 = 2
            take: 2,
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              name: 'asc',
            },
          });
      
          expect(mockDatabaseService.user.count).toHaveBeenCalled();
          expect(result).toEqual({
            data: mockUsers,
            total: 12,
            page: 2,
            lastPage: 6, // Math.ceil(12 / 2)
          });
        });
  });


  describe('findByEmail()', () => {
        it('deve retornar o usuário correspondente ao email', async () => {
          const email = 'julio@email.com';
          const mockUser = {
            id: 1,
            name: 'Julio',
            email,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
      
          mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);
      
          const result = await service.findByEmail(email);
      
          expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({ where: { email } });
          expect(result).toEqual(mockUser);
        });
  });

  describe('findOne()', () => {
          it('deve retornar o usuário correspondente ao ID', async () => {
            const id = 1;
            const mockUser = {
              id,
              name: 'Julio',
              email: 'julio@email.com',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
        
            mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);
        
            const result = await service.findOne(id);
        
            expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
              where: { id },
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            });
        
            expect(result).toEqual(mockUser);
          });
        
          it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
            const id = 99;
            mockDatabaseService.user.findUnique.mockResolvedValue(null);
        
            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
            expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
              where: { id },
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            });
          });
  });


  describe('update()', () => {
    it('deve atualizar e retornar o usuário (sem senha)', async () => {
      const id = 1;
      const updateUserDto = {
        name: 'Julio Atualizado',
        password: 'novaSenha',
      };
  
      const userBeforeUpdate = { id, name: 'Julio', email: 'julio@email.com' };
      const userAfterUpdate = {
        id,
        name: 'Julio Atualizado',
        email: 'julio@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      mockDatabaseService.user.findUnique.mockResolvedValue(userBeforeUpdate);
      mockDatabaseService.user.update.mockResolvedValue({ ...userAfterUpdate, password: 'hashedpassword' });
  
      const result = await service.update(id, updateUserDto);
  
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockDatabaseService.user.update).toHaveBeenCalled();
      expect(result).toEqual(userAfterUpdate);
    });
  
    it('deve lançar NotFoundException se o usuário não existir', async () => {
      const id = 99;
      const updateUserDto = { name: 'Alguém' };
  
      mockDatabaseService.user.findUnique.mockResolvedValue(null);
  
      await expect(service.update(id, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({ where: { id } });
    });
  });
  

  describe('remove()', () => {
    it('deve remover o usuário e retornar mensagem de sucesso', async () => {
      const id = 1;
      const user = { id, name: 'Julio', email: 'julio@email.com' };
  
      mockDatabaseService.user.findUnique.mockResolvedValue(user);
      mockDatabaseService.user.delete.mockResolvedValue(user);
  
      const result = await service.remove(id);
  
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockDatabaseService.user.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual({ message: `Usuário ${id} removido com sucesso.` });
    });
  
    it('deve lançar NotFoundException se o usuário não existir', async () => {
      const id = 1000;
  
      mockDatabaseService.user.findUnique.mockResolvedValue(null);
  
      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockDatabaseService.user.delete).not.toHaveBeenCalled();
    });
  });
  
  
  
});

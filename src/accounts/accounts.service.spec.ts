import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { BadRequestException,NotFoundException,ForbiddenException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;

  const mockDatabaseService = {
    account: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


 describe('create()', () => {

    it('deve criar uma nova conta', async () => {

         const dto: CreateAccountDto = {
          name: "New Account"
         }
         const userId:number = 1;
         mockDatabaseService.account.create.mockImplementation(({ data },userId) => ({
          id: 1,
          ...data,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

         const result = await service.create(dto,userId);
         expect(mockDatabaseService.account.create).toHaveBeenCalled();
         expect(result).toHaveProperty('id');
         expect(result).toHaveProperty('name');
         expect(result).toHaveProperty('userId');
    });

  });

  describe('findAll()', () => {

    it('deve retornar todas as contas do usuário', async () => {

      const mockAccounts = [
        { id: 1, name: 'Account 1', userId:1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Account 2', userId:1, createdAt: new Date(), updatedAt: new Date() },
      ];
      const userId:number = 1;

      mockDatabaseService.account.findMany = jest.fn().mockResolvedValue(mockAccounts);
      const result = await service.findAll(userId);
      
      expect(mockDatabaseService.account.findMany).toHaveBeenCalledWith({ where: { userId: userId } });
      expect(result[1].name).toEqual("Account 2");
      expect(result[1].userId).toEqual(1);
    });

  });

  describe('findOne()', () => {

    it('deve retornar a conta correspondente ao ID', async () => {
      const id:number  = 1;
      const userId:number = 1;
      const mockAccount = {id, name: 'Account 1',userId: 1,createdAt: new Date(),updatedAt: new Date()};
      mockDatabaseService.account.findUnique.mockResolvedValue(mockAccount);
      const result = await service.findOne(id,userId);
      expect(mockDatabaseService.account.findUnique).toHaveBeenCalledWith({ where: { id: id },select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true} });
      expect(result).toEqual(mockAccount);
    });

    it('deve lançar NotFoundException se a categoria não existir', async () => {
      const id = 10000;
      const userId:number = 1;
      mockDatabaseService.account.findUnique.mockResolvedValue(null);
      await expect(service.findOne(id,userId)).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.account.findUnique).toHaveBeenCalledWith({ where: { id: id },select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true} });
    });

    it('deve lançar ForbidenException se a conta não pertencer ao usuário', async () => {
          const id = 1;
          const userId:number = 2;
          const mockAccount = { id: 1, name: 'Category 1', userId:1, createdAt: new Date(), updatedAt: new Date() };
          mockDatabaseService.account.findUnique.mockResolvedValue(mockAccount);
          await expect(service.findOne(id,userId)).rejects.toThrow(ForbiddenException);
          expect(mockDatabaseService.account.findUnique).toHaveBeenCalledWith({ where: { id: id },select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true} });
        });

  });


   describe('update()', () => {
  
      it('deve atualizar e retornar a conta', async () => {
        const id:number = 1;
        const dto: CreateAccountDto = { name: "Updated Account"};
        const userId:number = 1;
      
       
        mockDatabaseService.account.update.mockImplementation(({where,data}) => ({
          id: where.id,
          ...data,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
  
        const result = await service.update(id,dto,userId);
        
        expect(mockDatabaseService.account.findUnique).toHaveBeenCalledWith({ where: { id } });
        expect(mockDatabaseService.account.update).toHaveBeenCalled();
        expect(result.name).toEqual("Updated Account");
        
  
      });
  
      it('deve lançar NotFoundException se a conta não existir', async () => {
        const id = 10000;
        const dto: CreateAccountDto = { name: "Updated Account"};
        const userId:number = 1;
  
        mockDatabaseService.account.findUnique.mockResolvedValue(null);
  
       
        await expect(service.update(id,dto,userId)).rejects.toThrow(NotFoundException);
        expect(mockDatabaseService.account.findUnique).toHaveBeenCalledWith({ where: { id } })
      });
  
      it('deve lançar ForbidenException se a categoria não pertencer ao usuário', async () => {
        const id = 1;
        const userId:number = 2;
        const mockAccount = { id: 1, name: 'Category 1', userId:1, createdAt: new Date(), updatedAt: new Date() };
        mockDatabaseService.account.findUnique.mockResolvedValue(mockAccount);
        await expect(service.findOne(id,userId)).rejects.toThrow(ForbiddenException);
      });
  
    });




});

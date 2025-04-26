import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BadRequestException,NotFoundException,ForbiddenException } from '@nestjs/common';


describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockDatabaseService = {
    category: {
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
      providers: [CategoriesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  describe('create()', () => {

    it('deve criar uma nova categoria', async () => {

         const dto: CreateCategoryDto = {
          name: "New Category"
         }
         const userId:number = 1;
         mockDatabaseService.category.create.mockImplementation(({ data },userId) => ({
          id: 1,
          ...data,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

         const result = await service.create(dto,userId);
         expect(mockDatabaseService.category.create).toHaveBeenCalled();
         expect(result).toHaveProperty('id');
         expect(result).toHaveProperty('name');
         expect(result).toHaveProperty('userId');
    });

  });

  describe('findAll()', () => {

    it('deve retornar todas as categorias do usuário', async () => {

      const mockCategories = [
        { id: 1, name: 'Category 1', userId:1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Category 2', userId:1, createdAt: new Date(), updatedAt: new Date() },
      ];
      const userId:number = 1;

      mockDatabaseService.category.findMany = jest.fn().mockResolvedValue(mockCategories);
      const result = await service.findAll(userId);
      
      expect(mockDatabaseService.category.findMany).toHaveBeenCalledWith({ where: { userId: userId } });
      expect(result[1].name).toEqual("Category 2");
      expect(result[1].userId).toEqual(1);
    });

  });

  describe('findOne()', () => {

    it('deve retornar a categoria correspondente ao ID', async () => {
      const id:number  = 1;
      const userId:number = 1;
      const mockCategory = {id, name: 'Category 1',userId: 1,createdAt: new Date(),updatedAt: new Date()};
      mockDatabaseService.category.findUnique.mockResolvedValue(mockCategory);
      const result = await service.findOne(id,userId);
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id: id },select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true} });
      expect(result).toEqual(mockCategory);
    });


    it('deve lançar NotFoundException se a categoria não existir', async () => {
      const id = 10000;
      const userId:number = 1;
      mockDatabaseService.category.findUnique.mockResolvedValue(null);
      await expect(service.findOne(id,userId)).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id: id },select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true} });
    });

    it('deve lançar ForbidenException se a categoria não pertencer ao usuário', async () => {
      const id = 1;
      const userId:number = 2;
      const mockCategory = { id: 1, name: 'Category 1', userId:1, createdAt: new Date(), updatedAt: new Date() };
      mockDatabaseService.category.findUnique.mockResolvedValue(mockCategory);
      await expect(service.findOne(id,userId)).rejects.toThrow(ForbiddenException);
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id: id },select:{id:true,name:true,userId:true,createdAt:true,updatedAt:true} });
    });

  });

  describe('update()', () => {

    it('deve atualizar e retornar a categoria', async () => {
      const id:number = 1;
      const dto: CreateCategoryDto = { name: "Updated Category"};
      const userId:number = 1;
    
     
      mockDatabaseService.category.update.mockImplementation(({where,data}) => ({
        id: where.id,
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      const result = await service.update(id,dto,userId);
      
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockDatabaseService.category.update).toHaveBeenCalled();
      expect(result.name).toEqual("Updated Category");
      

    });

    it('deve lançar NotFoundException se a categoria não existir', async () => {
      const id = 10000;
      const dto: CreateCategoryDto = { name: "Updated Category"};
      const userId:number = 1;

      mockDatabaseService.category.findUnique.mockResolvedValue(null);

     
      await expect(service.update(id,dto,userId)).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id } })
      expect(mockDatabaseService.category.update).not.toHaveBeenCalled();
    });

    it('deve lançar ForbidenException se a categoria não pertencer ao usuário', async () => {
      const id = 1;
      const userId:number = 2;
      const mockCategory = { id: 1, name: 'Category 1', userId:1, createdAt: new Date(), updatedAt: new Date() };
      mockDatabaseService.category.findUnique.mockResolvedValue(mockCategory);
      await expect(service.findOne(id,userId)).rejects.toThrow(ForbiddenException);
      expect(mockDatabaseService.category.update).not.toHaveBeenCalled();
    });

  });

  describe('remove()', () => {
    it('deve remover a categoria', async () => {
      const id = 1;
      const userId:number = 1;
      const mockCategory = {id, name: 'Category 1',userId: 1,createdAt: new Date(),updatedAt: new Date()};
  
      mockDatabaseService.category.findUnique.mockResolvedValue(mockCategory);
      mockDatabaseService.category.delete.mockResolvedValue(mockCategory);
  
      const result = await service.remove(id,userId);
  
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockDatabaseService.category.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual({ message: `Categoria ${id} removida com sucesso.` });
    });
  
    it('deve lançar NotFoundException se a categoria não existir', async () => {
      const id = 1000;
      const userId:number = 1;
      mockDatabaseService.category.findUnique.mockResolvedValue(null);
  
      await expect(service.remove(id,userId)).rejects.toThrow(NotFoundException);
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockDatabaseService.category.delete).not.toHaveBeenCalled();
    });

    it('deve lançar ForbidenException se a categoria não pertencer ao usuário', async () => {
      const id = 1;
      const userId:number = 2;
      const mockCategory = {id, name: 'Category 1',userId: 1,createdAt: new Date(),updatedAt: new Date()};

      mockDatabaseService.category.findUnique.mockResolvedValue(mockCategory);
      mockDatabaseService.category.delete.mockResolvedValue(mockCategory);
  
      await expect(service.remove(id,userId)).rejects.toThrow(ForbiddenException);
      expect(mockDatabaseService.category.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(mockDatabaseService.category.delete).not.toHaveBeenCalled();
    });
    
  });


});

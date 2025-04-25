import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { DatabaseService } from 'src/database/database.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockDatabaseService = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

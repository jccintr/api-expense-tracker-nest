import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { DatabaseService } from 'src/database/database.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

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
      providers: [TransactionsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

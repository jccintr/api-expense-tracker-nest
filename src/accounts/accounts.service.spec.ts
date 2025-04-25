import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { DatabaseService } from 'src/database/database.service';

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
});

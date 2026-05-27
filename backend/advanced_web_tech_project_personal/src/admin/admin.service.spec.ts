import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: DataSource, useValue: { query: jest.fn() } },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

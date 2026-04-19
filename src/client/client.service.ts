import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateClientDto, user: User): Promise<Client> {
    const client = this.clientRepository.create({
      ...dto,
      user,
    });
    const savedClient = await this.clientRepository.save(client);

    // Invalidate clients list cache
    await this.cacheManager.del(`clients_list_${user.id}`);

    return savedClient;
  }

  async findAll(page: number, limit: number, user: User, search?: string) {
    const cacheKey = `clients_list_${user.id}_page_${page}_limit_${limit}_search_${search || 'all'}`;
    let cachedResult = await this.cacheManager.get<object>(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const query = this.clientRepository
      .createQueryBuilder('client')
      .where('client.user.id = :userId', { userId: user.id })
      .andWhere('client.isActive = :isActive', { isActive: true });

    if (search) {
      query.andWhere('client.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('client.createdAt', 'DESC')
      .getManyAndCount();

    const result = { data, total, page, limit };
    await this.cacheManager.set(cacheKey, result);

    return result;
  }

  async findOne(id: string, userId: string): Promise<Client> {
    const cacheKey = `client_${id}_user_${userId}`;
    let client = await this.cacheManager.get<Client>(cacheKey);

    if (!client) {
      const foundClient = await this.clientRepository.findOne({
        where: { id, user: { id: userId } },
      });
      if (!foundClient) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      client = foundClient;
      await this.cacheManager.set(cacheKey, client);
    }
    return client;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateClientDto,
  ): Promise<Client> {
    const client = await this.findOne(id, userId);
    Object.assign(client, dto);
    const updatedClient = await this.clientRepository.save(client);

    // Invalidate caches
    await this.cacheManager.del(`client_${id}_user_${userId}`);
    await this.cacheManager.del(`clients_list_${userId}`);

    return updatedClient;
  }

  async remove(id: string, userId: string) {
    const client = await this.findOne(id, userId);
    client.isActive = false;
    await this.clientRepository.save(client);

    // Invalidate caches
    await this.cacheManager.del(`client_${id}_user_${userId}`);
    await this.cacheManager.del(`clients_list_${userId}`);

    return { message: `Client ${client.name} archived successfully` };
  }
}

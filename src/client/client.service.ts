import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
  ) {}

  async create(dto: CreateClientDto, user: User): Promise<Client> {
    const client = this.clientRepository.create({
      ...dto,
      user,
    });
    return this.clientRepository.save(client);
  }

  async findAll(page: number, limit: number, user: User, search?: string) {
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

    return { data, total, page, limit };
  }

  async findOne(id: string, userId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
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
    return this.clientRepository.save(client);
  }

  async remove(id: string, userId: string) {
    const client = await this.findOne(id, userId);
    client.isActive = false;
    await this.clientRepository.save(client);
    return { message: `Client ${client.name} archived successfully` };
  }
}

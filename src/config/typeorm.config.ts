import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Invoice } from '../invoice/entities/invoice.entities';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
  entities: [Invoice],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});

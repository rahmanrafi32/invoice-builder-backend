import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const baseConfig: DataSourceOptions = {
  type: 'postgres',
  entities: [__dirname + '/../**/*.entities{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: !isProduction,
};

const prodConfig: DataSourceOptions = {
  ...baseConfig,
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
};

const localConfig: DataSourceOptions = {
  ...baseConfig,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
};

export default new DataSource(isProduction ? prodConfig : localConfig);

import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get('NODE_ENV') || 'development';
  const isProduction = nodeEnv === 'production';

  const baseConfig = {
    type: 'postgres' as const,
    entities: [__dirname + '/../**/*.entities{.ts,.js}'],
    synchronize: false,
    logging: nodeEnv === 'development',
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsRun: false,
  };

  if (isProduction) {
    return {
      ...baseConfig,
      url: configService.get('DATABASE_URL'),
      ssl: { rejectUnauthorized: true },
    } as TypeOrmModuleOptions;
  }

  return {
    ...baseConfig,
    host: configService.get('DB_HOST'),
    port: parseInt(<string>configService.get('DB_PORT'), 10),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    ssl: false,
  } as TypeOrmModuleOptions;
};

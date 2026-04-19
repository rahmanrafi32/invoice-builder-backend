import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConfigService } from '@nestjs/config';

export const getRedisConfig = async (
  configService: ConfigService,
): Promise<CacheModuleOptions> => {
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<number>('REDIS_PORT', 6379);
  const ttlSeconds = configService.get<number>('CACHE_TTL_SECONDS', 300);
  const max = configService.get<number>('CACHE_MAX_ITEMS', 1000);

  try {
    const config: any = {
      socket: {
        host,
        port,
        reconnectStrategy: (retries: number) => {
          const delay = Math.min(retries * 50, 2000);
          console.log(
            `[Redis] Reconnect attempt ${retries}, delay: ${delay}ms`,
          );
          return delay;
        },
      },
      ttl: ttlSeconds,
    };


    const store = await redisStore(config);

    console.log(`[Redis] ✅ Connected successfully to ${host}:${port}`);

    return {
      isGlobal: true,
      store,
      max,
    };
  } catch (error) {
    console.error(
      `[Redis] ⚠️ Connection failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.log('[Redis] Continuing without cache...');

    return {
      isGlobal: true,
      store: undefined,
      max,
    };
  }
};

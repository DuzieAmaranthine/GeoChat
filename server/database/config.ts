import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import '../env';

export const config: TypeOrmModuleOptions =
  process.env.NODE_ENV === 'development'
    ? {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database: process.env.DATABASE_URL,
        autoLoadEntities: true,
      }
    : {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: true },
      };
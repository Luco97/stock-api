// Modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AuthModule } from '../shared/auth/auth.module';

// Entities
import { UserEntity } from './user/model/user-entity';
import { ItemEntity } from './item/model/item-entity';

// Services
import { ItemRepositoryService } from './item/repository/item-repository.service';

// User respolvers
import { LogInResolver } from './user/resolver/log-in.resolver';
import { SignInResolver } from './user/resolver/sign-in.resolver';
import { UserRepositoryService } from './user/repository/user-repository.service';

// Items respolvers
import { CreateItemResolver } from './item/resolver/create-item.resolver';
import { ReadItemResolver } from './item/resolver/read-item.resolver';
import { UpdateItemResolver } from './item/resolver/update-item.resolver';
import { DeleteItemResolver } from './item/resolver/delete-item.resolver';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        schema: 'stock-db',
        entities: [UserEntity, ItemEntity],
        url: configService.get('DATABASE_URL'),
        synchronize:
          configService.get('NODE_ENV') != 'production' ? true : false,
        autoLoadEntities: true,
        logging: 'all',
        extra:
          configService.get('NODE_ENV') == 'production'
            ? {
                ssl: {
                  sslmode: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, ItemEntity]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'types.gql',
      persistedQueries: false,
      cache: 'bounded',
    }),
    AuthModule,
  ],
  providers: [
    UserRepositoryService,
    SignInResolver,
    LogInResolver,
    ItemRepositoryService,
    CreateItemResolver,
    ReadItemResolver,
    UpdateItemResolver,
    DeleteItemResolver,
  ],
})
export class DatabaseModule {}

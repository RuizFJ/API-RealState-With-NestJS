import { Module } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AgentRequestModule } from './agent-request/agent-request.module'; // Assuming you have an AgentRequestModule
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PropertiesModule,
    ConfigModule.forRoot({
      isGlobal: true, // hace disponible config en toda la app
    }),
    TypeOrmModule.forRoot({
      
      
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //en produccion no se debe usar
    }),
    UsersModule,
    AgentRequestModule,
    AuthModule, // Assuming you have an AgentRequestModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

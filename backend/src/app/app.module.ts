import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { gameGateway } from "../game/game.gateway";
import { GameModule } from 'src/game/game.module';
import { AdminModule } from 'src/admin/admin.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    AuthModule,
    AdminModule,
    GameModule,
    ChatModule,
  ],
  providers: [ gameGateway ],
})
export class AppModule {}

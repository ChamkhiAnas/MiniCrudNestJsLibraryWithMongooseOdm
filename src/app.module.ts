import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorsModule } from './modules/authors/authors.module';
import { BooksModule } from './modules/books/books.module';
import { GenresModule } from './modules/genres/genres.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // Get MONGO_URI from .env
      }),
      inject: [ConfigService],
    }),
    AuthorsModule,
    BooksModule,
    GenresModule,
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

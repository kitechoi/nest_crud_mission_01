import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './infrastructure/entity/ArticleEntity';
import { ArticleRepository } from './infrastructure/ArticleRepository';
import { ArticleRepositoryImpl } from './infrastructure/repositoryImpl/ArticleRepositoryImpl';
import { ArticleRepositoryImplMapper } from './infrastructure/mapper/ArticleRepositoryImplMapper';
import { ArticleController } from './presentation/ArticleController';
import { CreateArticleUseCase } from './application/CreateArticleUseCase/CreateArticleUseCase';
import { DeleteArticleUseCase } from './application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCase } from './application/FindAllArticleUseCase/FindAllArticleUseCase';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [
    CreateArticleUseCase,
    DeleteArticleUseCase,
    FindAllArticleUseCase,
    ArticleRepositoryImplMapper,
    {
      provide: 'ArticleRepository',
      useClass: ArticleRepositoryImpl,
    },
  ],
})
export class ArticleModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './infrastructure/entity/ArticleEntity';
import { ARTICLE_REPOSITORY } from './infrastructure/ArticleRepository';
import { ArticleRepositoryImpl } from './infrastructure/repositoryImpl/ArticleRepositoryImpl';
import { ArticleRepositoryImplMapper } from './infrastructure/mapper/ArticleRepositoryImplMapper';
import { ArticleController } from './presentation/ArticleController';
import { CreateArticleUseCase } from './application/CreateArticleUseCase/CreateArticleUseCase';
import { DeleteArticleUseCase } from './application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCase } from './application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from './application/UpdateArticleUseCase/UpdateArticleUseCase';
import { UserModule } from 'src/user/UserModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity]),
    UserModule],
  controllers: [ArticleController],
  providers: [
    CreateArticleUseCase,
    DeleteArticleUseCase,
    FindAllArticleUseCase,
    UpdateArticleUseCase,
    ArticleRepositoryImplMapper,
    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepositoryImpl
    },
  ],
})
export class ArticleModule {}

import { Module } from '@nestjs/common';
import { ArticleController } from './presentation/ArticleController';
import { CreateArticleUseCase } from './application/CreateArticleUseCase/CreateArticleUseCase';

@Module({
  controllers: [ArticleController],
  providers: [CreateArticleUseCase],
})
export class ArticleModule {}

import { Injectable, Inject } from '@nestjs/common';
import { CreateArticleUseCaseRequest } from './dto/CreateArticleUseCaseRequest';
import { CreateArticleUseCaseResponse } from './dto/CreateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import { Password } from '../../domain/vo/Password';
import { ArticleRepository } from '../../infrastructure/ArticleRepository'

@Injectable()
export class CreateArticleUseCase {
  constructor(
      @Inject('ArticleRepository')
      private readonly articleRepository:ArticleRepository,
      ) {}

  async execute(request: CreateArticleUseCaseRequest): Promise<CreateArticleUseCaseResponse> {

    const article = Article.create({
      title: request.title,
      content:request.content,
      name: request.name,
      password: Password.create(request.password)
    });
    
    const savedArticle = await this.articleRepository.save(article);

    return {
      article: savedArticle
    };
  }
}

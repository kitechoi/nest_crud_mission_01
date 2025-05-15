import { Injectable, Inject } from '@nestjs/common';
import { Article } from '../../domain/Article';
import { CreateArticleUseCaseRequest } from './dto/CreateArticleUseCaseRequest';
import { CreateArticleUseCaseResponse } from './dto/CreateArticleUseCaseResponse';
import {ArticleRepository} from '../../infrastructure/ArticleRepository'

@Injectable()
export class CreateArticleUseCase {
  constructor(
      @Inject('ArticleRepository')
      private readonly articleRepository:ArticleRepository,
      ) {}

  async execute(request: CreateArticleUseCaseRequest): Promise<CreateArticleUseCaseResponse> {
    const article = Article.create(request);
    const saved = await this.articleRepository.save(article);

    return {
      id: saved.id,
      title: saved.title,
      content: saved.content,
      name: saved.name,
    };
  }
}

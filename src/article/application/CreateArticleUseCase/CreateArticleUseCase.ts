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
//     this.articles.push(article);
//     console.log('누적 게시글 목록:', this.articles);

    // Result<> 등 패턴 도입 가능.
    return {
      title: article.title,
      content: article.content,
      name: article.name,
    };
  }
}

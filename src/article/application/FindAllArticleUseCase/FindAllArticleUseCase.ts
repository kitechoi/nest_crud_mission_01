import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Article } from '../../domain/Article';
import {ArticleRepository} from '../../infrastructure/ArticleRepository'
import { FindAllArticleUseCaseResponse } from './dto/FindAllArticleUseCaseResponse';
import { FindAllArticleUseCaseRequest } from './dto/FindAllArticleUseCaseRequest';

@Injectable()
export class FindAllArticleUseCase {
  constructor(
    @Inject('ArticleRepository')
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(request: FindAllArticleUseCaseRequest): Promise<FindAllArticleUseCaseResponse[]> {
    const { page, limit } = request;
    const offset = (page - 1) * limit;

    const articles = await this.articleRepository.findAll(limit, offset);
    return articles.map((article) => ({
      title: article.title,
      content: article.content,
      name: article.name,
    }));

  }
}

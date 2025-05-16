import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { FindAllArticleUseCaseResponse } from './dto/FindAllArticleUseCaseResponse';
import { FindAllArticleUseCaseRequest } from './dto/FindAllArticleUseCaseRequest';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../infrastructure/ArticleRepository'

@Injectable()
export class FindAllArticleUseCase {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(request: FindAllArticleUseCaseRequest): Promise<FindAllArticleUseCaseResponse[]> {
    const { page, limit } = request;
    const offset = (page - 1) * limit;

    const articles = await this.articleRepository.findAll(limit, offset);

    return articles.map((article) => ({
      article: article
    }));
  }
}

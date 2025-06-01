import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/core/application/UseCase';
import {
  ARTICLE_REPOSITORY,
  ArticleRepository,
} from '../../infrastructure/ArticleRepository';
import { FindAllArticleUseCaseRequest } from './dto/FindAllArticleUseCaseRequest';
import { FindAllArticleUseCaseResponse } from './dto/FindAllArticleUseCaseResponse';

@Injectable()
export class FindAllArticleUseCase
  implements
    UseCase<FindAllArticleUseCaseRequest, FindAllArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(
    request: FindAllArticleUseCaseRequest,
  ): Promise<FindAllArticleUseCaseResponse> {
    const { page, limit, username } = request;
    const offset = (page - 1) * limit;

    const articles = await this.articleRepository.findAll(
      limit,
      offset,
      username,
    );

    return {
      ok: true,
      articles: articles,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from 'src/shared/core/application/UseCase';
import {
  ARTICLE_REPOSITORY,
  ArticleRepository,
} from '../../infrastructure/ArticleRepository';
import { FindAllArticleUseCaseRequest } from './dto/FindAllArticleUseCaseRequest';
import { FindAllArticleUseCaseResponse } from './dto/FindAllArticleUseCaseResponse';
import {
  USER_REPOSITORY,
  UserRepository,
} from 'src/user/infrastructure/UserRepository';

@Injectable()
export class FindAllArticleUseCase
  implements
    UseCase<FindAllArticleUseCaseRequest, FindAllArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    request: FindAllArticleUseCaseRequest,
  ): Promise<FindAllArticleUseCaseResponse> {
    const { page, limit, username } = request;
    const offset = (page - 1) * limit;

    let user = null;

    if (username) {
      user = await this.userRepository.findByUsername(username);
    }

    const userId = user ? user.id : undefined;

    const articles = await this.articleRepository.findAll(
      limit,
      offset,
      userId,
    );

    return {
      ok: true,
      articles: articles,
    };
  }
}

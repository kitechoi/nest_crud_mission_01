import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateArticleUseCaseRequest } from './dto/CreateArticleUseCaseRequest';
import { CreateArticleUseCaseResponse } from './dto/CreateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import {
  ArticleRepository,
  ARTICLE_REPOSITORY,
} from '../../infrastructure/ArticleRepository';
import { UseCase } from 'src/shared/core/application/UseCase';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CreateArticleUseCase
  implements UseCase<CreateArticleUseCaseRequest, CreateArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  @Transactional()
  async execute(
    request: CreateArticleUseCaseRequest,
  ): Promise<CreateArticleUseCaseResponse> {
    const article = Article.createNew({
      title: request.title,
      content: request.content,
      userId: request.userIdFromDB,
    }).value;

    const savedArticle = await this.articleRepository.save(
      article,
      request.userIdFromDB,
    );

    return {
      ok: true,
      article: savedArticle,
    };
  }
}

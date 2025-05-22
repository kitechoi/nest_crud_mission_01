import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateArticleUseCaseRequest } from './dto/CreateArticleUseCaseRequest';
import { CreateArticleUseCaseResponse } from './dto/CreateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import { Password } from '../../../user/domain/Password';
import {
  ArticleRepository,
  ARTICLE_REPOSITORY,
} from '../../infrastructure/ArticleRepository';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class CreateArticleUseCase
  implements UseCase<CreateArticleUseCaseRequest, CreateArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(
    request: CreateArticleUseCaseRequest,
  ): Promise<CreateArticleUseCaseResponse> {

    const articleResult = Article.createNew({
      title: request.title,
      content: request.content,
      authorId: request.userId,
    });

    if (!articleResult.isSuccess) {
      throw new BadRequestException(articleResult.error);
    }
    console.log(articleResult.value);

    const savedArticle = await this.articleRepository.save(
      articleResult.value, request.userIdFromDB);

    return {
      ok: true,
      article: savedArticle,
    };
  }
}

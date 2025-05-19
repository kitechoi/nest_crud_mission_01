import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CreateArticleUseCaseRequest } from './dto/CreateArticleUseCaseRequest';
import { CreateArticleUseCaseResponse } from './dto/CreateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import { Password } from '../../domain/Password';
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
    const passwordResult = Password.create({ password: request.password });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const articleResult = Article.createNew({
      title: request.title,
      content: request.content,
      name: request.name,
      password: passwordResult.value,
    });

    if (!articleResult.isSuccess) {
      throw new BadRequestException(articleResult.error);
    }

    const savedArticle = await this.articleRepository.save(articleResult.value);
    return {
      ok: true,
      article: savedArticle,
    };
  }
}

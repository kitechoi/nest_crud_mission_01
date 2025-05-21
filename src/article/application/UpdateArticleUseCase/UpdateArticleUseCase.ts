import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateArticleUseCaseRequest } from './dto/UpdateArticleUseCaseRequest';
import { UpdateArticleUseCaseResponse } from './dto/UpdateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import { Password } from '../../../user/domain/Password';
import {
  ArticleRepository,
  ARTICLE_REPOSITORY,
} from '../../infrastructure/ArticleRepository';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class UpdateArticleUseCase
  implements UseCase<UpdateArticleUseCaseRequest, UpdateArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(
    request: UpdateArticleUseCaseRequest,
  ): Promise<UpdateArticleUseCaseResponse> {
    const passwordResult = Password.create({ password: request.password });
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (!article.password.equals(passwordResult.value)) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    const updatedArticle = Article.create(
      {
        title:
          typeof request.title !== 'undefined' ? request.title : article.title,
        content:
          typeof request.content !== 'undefined'
            ? request.content
            : article.content,
        name: article.name,
        password: article.password,
      },
      article.id,
    );

    if (!updatedArticle.isSuccess) {
      throw new BadRequestException(updatedArticle.error);
    }

    const savedArticle = await this.articleRepository.save(
      updatedArticle.value,
    );

    return {
      ok: true,
      article: savedArticle,
    };
  }
}

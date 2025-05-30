import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
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
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UpdateArticleUseCase
  implements UseCase<UpdateArticleUseCaseRequest, UpdateArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  @Transactional()
  async execute(
    request: UpdateArticleUseCaseRequest,
  ): Promise<UpdateArticleUseCaseResponse> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (article.userId !== request.userIdFromDB) {
      throw new ForbiddenException('작성자만 수정할 수 있습니다.');
    }

    const updatedArticle = Article.create(
      {
        title:
          typeof request.title !== 'undefined' ? request.title : article.title,
        content:
          typeof request.content !== 'undefined'
            ? request.content
            : article.content,
        userId: article.userId,
      },
      article.id,
    );

    if (!updatedArticle.isSuccess) {
      throw new BadRequestException(updatedArticle.error);
    }

    const savedArticle = await this.articleRepository.save(
      updatedArticle.value,
      request.userIdFromDB,
    );

    return {
      ok: true,
      article: savedArticle,
    };
  }
}

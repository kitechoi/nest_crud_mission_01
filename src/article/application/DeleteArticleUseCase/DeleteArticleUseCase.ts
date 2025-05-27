import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DeleteArticleUseCaseRequest } from './dto/DeleteArticleUseCaseRequest';
import { Password } from '../../../user/domain/Password';
import {
  ArticleRepository,
  ARTICLE_REPOSITORY,
} from '../../infrastructure/ArticleRepository';
import { DeleteArticleUseCaseResponse } from './dto/DeleteArticleUseCaseResponse';
import { UseCase } from 'src/shared/core/application/UseCase';
import { Transactional, TransactionalError } from 'typeorm-transactional';

@Injectable()
export class DeleteArticleUseCase
  implements UseCase<DeleteArticleUseCaseRequest, DeleteArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  // @Transactional()
  async execute(
    request: DeleteArticleUseCaseRequest,
  ): Promise<DeleteArticleUseCaseResponse> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (article.userId !== request.userIdFromDB) {
      throw new ForbiddenException('작성자만 삭제할 수 있습니다.');
    }

    await this.articleRepository.delete(request.id);
    return { ok: true };
  }
}

import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from 'src/shared/core/application/UseCase';
import {
  ARTICLE_REPOSITORY,
  ArticleRepository,
} from '../../infrastructure/ArticleRepository';
import { DeleteArticleUseCaseRequest } from './dto/DeleteArticleUseCaseRequest';
import { DeleteArticleUseCaseResponse } from './dto/DeleteArticleUseCaseResponse';

@Injectable()
export class DeleteArticleUseCase
  implements UseCase<DeleteArticleUseCaseRequest, DeleteArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

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

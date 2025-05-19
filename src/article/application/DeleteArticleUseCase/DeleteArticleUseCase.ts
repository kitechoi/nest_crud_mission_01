import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteArticleUseCaseRequest } from './dto/DeleteArticleUseCaseRequest';
import { Password } from '../../domain/vo/Password';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../infrastructure/ArticleRepository'
import { DeleteArticleUseCaseResponse } from './dto/DeleteArticleUseCaseResponse';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class DeleteArticleUseCase implements UseCase<DeleteArticleUseCaseRequest, DeleteArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(
    request: DeleteArticleUseCaseRequest): Promise<DeleteArticleUseCaseResponse> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    const passwordResult = Password.create(request.password);
    if (
      !passwordResult.isSuccess ||
      !article.password.equals(passwordResult.value)
    ) {
      throw new ForbiddenException(
        '비밀번호가 일치하지 않거나 형식이 잘못되었습니다.',
      );
    }
    await this.articleRepository.delete(request.id);
    return { ok: true };
  }
}
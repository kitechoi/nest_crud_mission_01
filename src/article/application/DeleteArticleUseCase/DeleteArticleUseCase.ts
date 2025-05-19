import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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

    await this.articleRepository.delete(request.id);
    return { ok: true };
  }
}
import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteArticleUseCaseRequest } from './dto/DeleteArticleUseCaseRequest';
import { Password } from '../../domain/vo/Password';
import { ArticleRepository } from '../../infrastructure/ArticleRepository'

@Injectable()
export class DeleteArticleUseCase {
  constructor(
    @Inject('ArticleRepository')
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(request: DeleteArticleUseCaseRequest): Promise<void> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (!article.password.equals(Password.create(request.password))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    await this.articleRepository.delete(request.id);
  }
}
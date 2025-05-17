import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteArticleUseCaseRequest } from './dto/DeleteArticleUseCaseRequest';
import { Password } from '../../domain/vo/Password';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../infrastructure/ArticleRepository'

@Injectable()
export class DeleteArticleUseCase {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) { }

  async execute(request: DeleteArticleUseCaseRequest): Promise<void> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    const pwResult = Password.create(request.password);
    if (!pwResult.isSuccess || !article.password.equals(pwResult.value)) {
      throw new ForbiddenException('비밀번호가 일치하지 않거나 형식이 잘못되었습니다.');
    }

    await this.articleRepository.delete(request.id);
  }
}
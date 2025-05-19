import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UpdateArticleUseCaseRequest } from './dto/UpdateArticleUseCaseRequest';
import { UpdateArticleUseCaseResponse } from './dto/UpdateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import { Password } from '../../domain/vo/Password';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../infrastructure/ArticleRepository';

@Injectable()
export class UpdateArticleUseCase {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) { }

  async execute(request: UpdateArticleUseCaseRequest): Promise<UpdateArticleUseCaseResponse> {
    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    const pwResult = Password.create(request.password);
    if (!pwResult.isSuccess) {
      throw new BadRequestException(pwResult.error);
    }

    if (!article.password.equals(pwResult.value)) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    // 위에서 Password 일치 검사를 하면서 유효성 검사를 했는데, 아래 create에서 비밀번호 유효성 검사가 중복되고 있음

    const updatedArticle = Article.create({
      id: article.id,
      title: typeof request.title !== 'undefined' ? request.title : article.title,
      content: typeof request.content !== 'undefined' ? request.content : article.content,
      name: article.name,
      password: article.password,
    });

    if (!updatedArticle.isSuccess) {
      throw new BadRequestException(updatedArticle.error);
    }

    const savedArticle = await this.articleRepository.save(updatedArticle.value);

    return {
      ok: true,
      article: savedArticle
    };
  }
}

import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UpdateArticleUseCaseRequest } from './dto/UpdateArticleUseCaseRequest';
import { UpdateArticleUseCaseResponse } from './dto/UpdateArticleUseCaseResponse';
import { Article } from '../../domain/Article';
import { Password } from '../../domain/vo/Password';
import { ArticleId } from '../../domain/vo/ArticleId';
import { ArticleRepository, ARTICLE_REPOSITORY } from '../../infrastructure/ArticleRepository';
import { UseCase } from 'src/shared/core/application/UseCase';

@Injectable()
export class UpdateArticleUseCase implements UseCase<UpdateArticleUseCaseRequest, UpdateArticleUseCaseResponse>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticleRepository,
  ) {}

  async execute(
    request: UpdateArticleUseCaseRequest): Promise<UpdateArticleUseCaseResponse> {
    const articleIdResult = ArticleId.create(request.id);
    if (!articleIdResult.isSuccess) {
      throw new BadRequestException(articleIdResult.error);
    }

    const passwordResult = Password.create({ password: request.password});
    if (!passwordResult.isSuccess) {
      throw new BadRequestException(passwordResult.error);
    }

    const articleTempResult = Article.create({
      title: typeof request.title !== 'undefined' ? request.title : '임시제목입니다',
      content: typeof request.content !== 'undefined' ? request.content: '임시본문입니다',
      name: '임시이름입니다',
      password: passwordResult.value,
    });
    if (!articleTempResult.isSuccess) {
      throw new BadRequestException(articleTempResult.error);
    }

    const article = await this.articleRepository.findById(request.id);

    if (!article) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    if (!article.password.equals(passwordResult.value)) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    // 위에서 Password 일치 검사를 하면서 유효성 검사를 했는데, 아래 create에서 비밀번호 유효성 검사가 중복되고 있음

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

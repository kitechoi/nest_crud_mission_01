import { Body, Controller, Post, Delete, Param } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { CreateArticleUseCaseRequest } from '../application/CreateArticleUseCase/dto/CreateArticleUseCaseRequest';
import { ArticleControllerCreateArticleRequestBody, ArticleControllerDeleteArticleRequestBody } from './dto/ArticleControllerRequest'
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';

@Controller('articles')
export class ArticleController {
  constructor(
      private readonly createArticleUseCase: CreateArticleUseCase,
      private readonly deleteArticleUseCase: DeleteArticleUseCase,
      ) {}

// 글 생성
  @Post()
  async createArticle(
      @Body() body: ArticleControllerCreateArticleRequestBody
  ) {
    await this.createArticleUseCase.execute(
    {
          title: body.title,
          content: body.content,
          name: body.name,
          password: body.password,
        });

    return {
        ok: true
        // http 성공 응답 코드 내려줘야 하고
        // 생성 객체도 내려줘야 함.
        };
  }

// 글 삭제
  @Delete(':id')
    async deleteArticle(
      @Param('id') id: number,
      @Body() body: ArticleControllerDeleteArticleRequestBody,
    ): Promise<void> {
      await this.deleteArticleUseCase.execute({
        id: +id,
        password: body.password,
      });
    }
}


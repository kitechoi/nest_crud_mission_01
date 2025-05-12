import { Body, Controller, Get, Post, Delete, Put, Param } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { CreateArticleUseCaseRequest } from '../application/CreateArticleUseCase/dto/CreateArticleUseCaseRequest';
import { ArticleControllerCreateArticleRequestBody, ArticleControllerDeleteArticleRequestBody } from './dto/ArticleControllerRequest'
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCaseResponse } from '../application/FindAllArticleUseCase/dto/FindAllArticleUseCaseResponse';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';

@Controller('articles')
export class ArticleController {
  constructor(
      private readonly createArticleUseCase: CreateArticleUseCase,
      private readonly deleteArticleUseCase: DeleteArticleUseCase,
      private readonly findAllArticleUseCase: FindAllArticleUseCase,
      ) {}

// 글 생성
  @Post()
  async createArticle(
      @Body() body: ArticleControllerCreateArticleRequestBody) {
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
      @Body() body: ArticleControllerDeleteArticleRequestBody): Promise<void> {
      await this.deleteArticleUseCase.execute({
        id: +id,
        password: body.password,
      });
    }

// 호출하면 내려주는데 몇개를 내려줄까? => 페이징 로직 관련 로직 위치는 어디에
// 쿼리 파라미터의 종류: 1. 개수 2. 정렬순서? 3...
// 삭제된 게시글 번호 비포함하여 active 객체 10개씩.

  @Get()
  async getArticle(): Promise<FindAllArticleUseCaseResponse[]> {
      const articles = await this.findAllArticleUseCase.execute();
      return articles;
      }
}


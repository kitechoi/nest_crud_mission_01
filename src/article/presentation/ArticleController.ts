import { Body, Controller, Get, Post, Delete, Put, Patch, Param, Query } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { CreateArticleUseCaseRequest } from '../application/CreateArticleUseCase/dto/CreateArticleUseCaseRequest';
import { ArticleControllerCreateArticleRequestBody, ArticleControllerDeleteArticleRequestBody, ArticleControllerUpdateArticleRequestBody, ArticleControllerDeleteArticleRequestParam, ArticleControllerUpdateArticleRequestParam, ArticleControllerFindAllArticleRequestQuery } from './dto/ArticleControllerRequest'
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCaseResponse } from '../application/FindAllArticleUseCase/dto/FindAllArticleUseCaseResponse';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from '../application/UpdateArticleUseCase/UpdateArticleUseCase';

@Controller('articles')
export class ArticleController {
  constructor(
      private readonly createArticleUseCase: CreateArticleUseCase,
      private readonly deleteArticleUseCase: DeleteArticleUseCase,
      private readonly findAllArticleUseCase: FindAllArticleUseCase,
      private readonly updateArticleUseCase: UpdateArticleUseCase,
      ) {}

// 글 생성
  @Post()
  async createArticle(
      @Body() body: ArticleControllerCreateArticleRequestBody) {
    const article = await this.createArticleUseCase.execute(
    {
          title: body.title,
          content: body.content,
          name: body.name,
          password: body.password,
        });

    return {
        ok: true,
        article
        // http 성공 응답 코드 내려줘야 하고
        // 생성 객체도 내려줘야 함.
        };
  }

  // 글 삭제
  @Delete(':id')
  async deleteArticle(
      @Param() params: ArticleControllerDeleteArticleRequestParam,
      @Body() body: ArticleControllerDeleteArticleRequestBody): Promise<void> {
      await this.deleteArticleUseCase.execute({
        id: params.id,
        password: body.password,
      });
    }

// 호출하면 내려주는데 몇개를 내려줄까? => 페이징 로직 관련 로직 위치는 어디에
// 쿼리 파라미터의 종류: 1. 개수 2. 정렬순서? 3...
// 삭제된 게시글 번호 비포함하여 active 객체 10개씩.
  @Get()
  async getArticle(
      @Query() query: ArticleControllerFindAllArticleRequestQuery,
    ): Promise<FindAllArticleUseCaseResponse[]> {
      const articles = await this.findAllArticleUseCase.execute({
          page: query.page,
          limit: query.limit,
         });
      return articles;
  }

  // 글 수정
  // DB 조회 먼저 하지 말고, controller에 req이 들어온 시점에 변경내용 유효성 검사를 먼저.
  @Patch(':id')
  async updateArticle(
      @Param() params: ArticleControllerUpdateArticleRequestParam,
      @Body() body: ArticleControllerUpdateArticleRequestBody): Promise<void> {
          await this.updateArticleUseCase.execute(
              {
              id: params.id,
              title: body.title,
              content: body.content,
              password: body.password,
              });
          }
}


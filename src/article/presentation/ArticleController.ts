import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, Param, Patch, Post, Query, Logger, UseGuards, Req, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from '../application/UpdateArticleUseCase/UpdateArticleUseCase';
import { ArticleControllerCreateArticleRequestBody, ArticleControllerDeleteArticleRequestBody, ArticleControllerDeleteArticleRequestParam, ArticleControllerFindAllArticleRequestQuery, ArticleControllerUpdateArticleRequestBody, ArticleControllerUpdateArticleRequestParam } from './dto/ArticleControllerRequest';
import { ArticleControllerCreateArticleResponse, ArticleControllerUpdateArticleResponse, ArticleControllerFineAllArticleResponse } from './dto/ArticleControllerResponse';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Request } from 'express';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);
  constructor(
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
    private readonly findAllArticleUseCase: FindAllArticleUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticle(
    @Req() request: Request,
    @Body() body: ArticleControllerCreateArticleRequestBody,
  ): Promise<{
    statusCode: number;
    ok: true;
    result: ArticleControllerCreateArticleResponse;
  }> {
    try {
      if (!request.user) {
        throw new UnauthorizedException('로그인이 필요합니다.');
      }
      const userId = request.user.userId;
      const userIdFromDB = request.user.userIdFromDB;
      // declare 인터페이스
      console.log(userId, userIdFromDB, ";;;;");
      const { ok, article } = await this.createArticleUseCase.execute({
        userId: userId,
        title: body.title,
        content: body.content,
        userIdFromDB: userIdFromDB,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }
      console.log(article);
      return {
        statusCode: HttpStatus.CREATED,
        ok: true,
        result: {
          id: article.id.toNumber(),
          title: article.title,
          content: article.content,
          authorId: userId,
        },
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(
    @Param() params: ArticleControllerDeleteArticleRequestParam,
    @Req() request: Request,
  ) {
    try {
      const { userId } = (request as any).user;
      const { ok } = await this.deleteArticleUseCase.execute({
        id: Number(params.id),
        userId: userId,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      return;
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getArticle(
    @Query() query: ArticleControllerFindAllArticleRequestQuery,
  ): Promise<{
    statusCode: number;
    ok: true;
    result: ArticleControllerFineAllArticleResponse[];
  }> {
    try {
      const { ok, articles } = await this.findAllArticleUseCase.execute({
        page: Number(query.page),
        limit: Number(query.limit),
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      const result = articles.map((article) => ({
        id: article.id.toNumber(),
        title: article.title,
        content: article.content,
      }));

      return {
        statusCode: HttpStatus.OK,
        ok: true,
        result: result,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateArticle(
    @Param() params: ArticleControllerUpdateArticleRequestParam,
    @Req() request: Request,
    @Body() body: ArticleControllerUpdateArticleRequestBody,
  ): Promise<{
    statusCode: number;
    ok: true;
    result: ArticleControllerUpdateArticleResponse;
  }> {
    try {
      const { userId, userIdFromDB } = (request as any).user;
      const { ok, article } = await this.updateArticleUseCase.execute({
        id: Number(params.id),
        title: body.title,
        content: body.content,
        userId: userId,
        userIdFromDB: userIdFromDB,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      return {
        statusCode: HttpStatus.OK,
        ok: true,
        result: {
          id: article.id.toNumber(),
          title: article.title,
          content: article.content,
        },
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }
}

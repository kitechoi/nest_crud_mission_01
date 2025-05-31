import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Logger,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuthGuard';
import { CreateArticleUseCase } from '../application/CreateArticleUseCase/CreateArticleUseCase';
import { DeleteArticleUseCase } from '../application/DeleteArticleUseCase/DeleteArticleUseCase';
import { FindAllArticleUseCase } from '../application/FindAllArticleUseCase/FindAllArticleUseCase';
import { UpdateArticleUseCase } from '../application/UpdateArticleUseCase/UpdateArticleUseCase';
import { FindUserByIdUseCase } from 'src/user/application/FindUserByIdUseCase/FindUserByIdUseCase';
import {
  ArticleControllerCreateArticleRequestBody,
  ArticleControllerDeleteArticleRequestParam,
  ArticleControllerFindAllArticleRequestQuery,
  ArticleControllerUpdateArticleRequestBody,
  ArticleControllerUpdateArticleRequestParam,
} from './dto/ArticleControllerRequest';
import {
  ArticleControllerCreateArticleResponse,
  ArticleControllerUpdateArticleResponse,
  ArticleControllerFineAllArticleResponse,
} from './dto/ArticleControllerResponse';

@Controller('articles')
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);
  constructor(
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
    private readonly findAllArticleUseCase: FindAllArticleUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Req() request: Request,
    @Body() body: ArticleControllerCreateArticleRequestBody,
  ): Promise<ArticleControllerCreateArticleResponse> {
    try {
      if (!request.user) {
        throw new UnauthorizedException();
      }
      const { id, username } = request.user;

      const { ok, article } = await this.createArticleUseCase.execute({
        userIdFromDB: id,
        username: username,
        title: body.title,
        content: body.content,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      return {
        id: article.id.toNumber(),
        title: article.title,
        content: article.content,
        username: username,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param() params: ArticleControllerDeleteArticleRequestParam,
    @Req() request: Request,
  ) {
    try {
      if (!request.user) {
        throw new UnauthorizedException();
      }
      const { id } = request.user;
      const { ok } = await this.deleteArticleUseCase.execute({
        id: Number(params.id),
        userIdFromDB: id,
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

  // findAllArticleUseCase 안에서 User도 같이 반환해주는 건?
  @Get()
  @HttpCode(HttpStatus.OK)
  async getArticle(
    @Query() query: ArticleControllerFindAllArticleRequestQuery,
  ): Promise<ArticleControllerFineAllArticleResponse[]> {
    try {
      const { ok, articles } = await this.findAllArticleUseCase.execute({
        page: Number(query.page),
        limit: Number(query.limit),
        username: query.username,
      });

      if (!ok) {
        throw new InternalServerErrorException();
      }

      return Promise.all(
        articles.map(async (article) => {
          const { user } = await this.findUserByIdUseCase.execute({
            id: article.userId,
          });

          return {
            id: article.id.toNumber(),
            title: article.title,
            content: article.content,
            username: user.username,
            nickname: user.nickname,
          };
        }),
      );
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  // @UseInterceptors()
  // @UseFilters()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param() params: ArticleControllerUpdateArticleRequestParam,
    @Req() request: Request,
    @Body() body: ArticleControllerUpdateArticleRequestBody,
  ): Promise<ArticleControllerUpdateArticleResponse> {
    try {
      if (!request.user) {
        throw new UnauthorizedException();
      }
      const { id, username } = request.user;
      const { ok, article } = await this.updateArticleUseCase.execute({
        id: Number(params.id),
        userIdFromDB: id,
        title: body.title,
        content: body.content,
      });
      if (!ok) {
        throw new InternalServerErrorException();
      }

      return {
        id: article.id.toNumber(),
        title: article.title,
        content: article.content,
        username: username,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }
}

import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Title, Content, Name, Password } from './validators/ValidatedFields';

export class ArticleControllerCreateArticleRequestBody {
  @Title()
  title: string;

  @Content()
  content: string;

  @Name()
  name: string;

  @Password()
  password: string;
}

export class ArticleControllerDeleteArticleRequestBody {
  @Password()
  password: string;
}

export class ArticleControllerUpdateArticleRequestBody {

  @IsOptional()
  @Title()
  title?: string;

  @IsOptional()
  @Content()
  content?: string;

  @Password()
  password: string;
}

export class ArticleControllerDeleteArticleRequestParam {
  @Type(() => Number)
  @IsInt()
  id: number;
}

export class ArticleControllerUpdateArticleRequestParam {
  @Type(() => Number)
  @IsInt()
  id: number;
}

export class ArticleControllerFindAllArticleRequestQuery {
  @Type(() => Number)
  @IsInt()
  page: number;

  @Type(() => Number)
  @IsInt()
  limit: number;
}
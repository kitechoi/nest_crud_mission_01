export class ArticleControllerCreateArticleRequestBody {
  title: string;
  content: string;
  name: string;
  password: string;
}

export class ArticleControllerDeleteArticleRequestBody {
  password: string;
}

export class ArticleControllerUpdateArticleRequestBody {
    content: string;
    password: string;
}
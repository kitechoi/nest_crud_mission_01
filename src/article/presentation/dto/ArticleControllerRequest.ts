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
    title: string;
    content: string;
    password: string;
}

export class ArticleControllerDeleteArticleRequestParam {
  id: number;
}

export class ArticleControllerUpdateArticleRequestParam {
  id: number;
}
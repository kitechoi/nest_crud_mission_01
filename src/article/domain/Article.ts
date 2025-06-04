import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';
import { User } from 'src/user/domain/User';
import { Result } from '../../shared/core/domain/Result';

export interface ArticleProps {
  title: string;
  content: string;
  userId: number;
}

export interface ExtendedArticleProps extends ArticleProps {
  user: User;
}

export class Article extends AggregateRoot<ArticleProps> {
  private constructor(props: ArticleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: ArticleProps, id?: UniqueEntityID): Result<Article> {
    if (!props.title || props.title.length > 50) {
      return Result.fail('Title must be 50 characters or fewer');
    }

    if (!props.content || props.content.length > 2000) {
      return Result.fail('Content must be 2000 characters or fewer');
    }

    if (!props.userId) {
      return Result.fail('User ID is required to create an article');
    }

    return Result.ok(new Article(props, id));
  }

  static createNew(props: ArticleProps): Result<Article> {
    return this.create({ ...props });
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get userId(): number {
    return this.props.userId;
  }
}

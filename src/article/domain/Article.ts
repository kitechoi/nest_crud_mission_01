import { Password } from '../../user/domain/Password';
import { Result } from '../../shared/core/domain/Result';
import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { UniqueEntityID } from 'src/shared/core/domain/UniqueEntityID';

export interface ArticleProps {
  title: string;
  content: string;
  name: string;
  password: Password;
}

export class Article extends AggregateRoot<ArticleProps> {
  private constructor(props: ArticleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: ArticleProps, id?: UniqueEntityID): Result<Article> {
    if (!props.title || props.title.length > 50) {
      return Result.fail('제목은 50자 이하로 입력해야 합니다.');
    }

    if (!props.content || props.content.length > 2000) {
      return Result.fail('본문은 2000자 이하로 입력해야 합니다.');
    }

    if (!props.name || props.name.length > 20 || /\s/.test(props.name)) {
      return Result.fail(
        '작성자 이름은 20자 이하이며, 공백을 포함할 수 없습니다.',
      );
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

  get name(): string {
    return this.props.name;
  }

  get password(): Password {
    return this.props.password;
  }
}

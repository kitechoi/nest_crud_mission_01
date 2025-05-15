import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, Matches, MinLength } from 'class-validator';

export function Title() {
  return applyDecorators(
    IsString(),
    MaxLength(50, { message: '제목은 50자 이하로 입력해야 합니다.' }),
  );
}

export function Content() {
  return applyDecorators(
    IsString(),
    MaxLength(2000, { message: '본문은 2000자 이하로 입력해야 합니다.' }),
  );
}

export function Name() {
  return applyDecorators(
    IsString(),
    MaxLength(20, { message: '작성자 이름은 20자 이하로 입력해야 합니다.' }),
    Matches(/^\S+$/, { message: '작성자 이름에는 공백이 들어갈 수 없습니다.' }),
  );
}

export function Password() {
  return applyDecorators(
    IsString(),
    MinLength(4),
    MaxLength(10),
    Matches(/^[a-zA-Z0-9]+$/, {
      message: '비밀번호는 영문자/숫자만 입력 가능합니다.',
    }),
  );
}

import { CoreResponse } from 'src/shared/core/application/CoreResponse';
import { User } from 'src/user/domain/User';

export interface FindUserByRefreshTokenUseCaseResponse extends CoreResponse {
  user: User;
}

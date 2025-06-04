import { CoreResponse } from 'src/shared/core/application/CoreResponse';

export interface CreateLoginUseCaseResponse extends CoreResponse {
  accessToken: string;
  refreshToken: string;
}

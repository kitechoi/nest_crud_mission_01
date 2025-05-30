import { CoreResponse } from 'src/shared/core/application/CoreResponse';

export interface CreateReissuedAccessTokenUseCaseResponse extends CoreResponse {
  accessToken: string;
}

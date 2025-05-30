import { CoreResponse } from "src/shared/core/application/CoreResponse";

export interface CreateTokenByUsernameUseCaseResonse extends CoreResponse {
  accessToken: string;
  refreshToken: string;
}

import { CoreResponse } from "src/shared/core/application/CoreResponse";

export interface CreateTokenByUserUseCaseResonse extends CoreResponse{
  accessToken: string;
  refreshToken: string;
}

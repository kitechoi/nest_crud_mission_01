import { CoreResponse } from "src/shared/core/application/CoreResponse";
import { User } from "src/user/domain/User";

export interface FindUserUseCaseResponse extends CoreResponse {
  user: User
}

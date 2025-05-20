import { CoreResponse } from "src/shared/core/application/CoreResponse";
import { User } from "src/user/domain/User";

export interface UserUseCaseResponse extends CoreResponse {
  user: User
}

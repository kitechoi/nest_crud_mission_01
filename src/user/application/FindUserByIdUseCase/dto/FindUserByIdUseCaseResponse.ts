import { CoreResponse } from "src/shared/core/application/CoreResponse";
import { User } from "src/user/domain/User";

export interface FindUserByIdUseCaseResponse extends CoreResponse{
  user: User
}

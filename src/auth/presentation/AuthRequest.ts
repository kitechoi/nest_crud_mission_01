
export class AuthRequestBody {
  user: {
    userId?: string;
    userPassword: string;
    name?: string;
  };
}

export class AuthControllerRequestBody {
  userId: string;
  userPassword: string;
}
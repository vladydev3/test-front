import { UserRespository } from "@/repository/auth/userRepository";
import { ILoginRequest, ILoginResponse, IRegisterRequest, IUser } from "@/types/auth";

export class AuthService {
  private userRepository: UserRespository;

  constructor(userService: UserRespository) {
    this.userRepository = userService;
  }

  async login(formLoginData: ILoginRequest): Promise<ILoginResponse> {
    return await this.userRepository.login(formLoginData);
  }

  async register(formSignupData: IRegisterRequest): Promise<IUser> {
    return await this.userRepository.register(formSignupData);
  }

  async users(): Promise<IUser[]> {
    return await this.userRepository.users();
  }

  async user(id: string): Promise<IUser> {
    return await this.userRepository.user(id);
  }
}

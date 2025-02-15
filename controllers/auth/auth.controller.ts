import {
  Body,
  Controller,
  Post,
  InternalServerErrorException,
  ConflictException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { User } from "@/utils/interface/user/User";

const SignUpValidator = new ZodValidationPipe(User.LogInOptions);

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signUp(@Body(SignUpValidator) payload: User.LogInOptions) {
    const result = this.authService.signUp(payload.username, payload.password);

    if (!result)
      throw new ConflictException(`Username ${payload.username} has been used`);

    return result;
  }

  @Post("login")
  logIn(@Body(SignUpValidator) payload: User.LogInOptions) {
    return this.authService.logIn(payload.username, payload.password);
  }
}

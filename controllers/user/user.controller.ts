import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Delete,
  ConflictException,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserFilterPipe } from "./user.pipe";
import { User } from "@/utils/interface/user/User";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { APIMapping } from "@/utils/interface/api";

const SignUpValidator = new ZodValidationPipe(User.LogInOptions);
const InformationValidator = new ZodValidationPipe(User.Information.partial());

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async listUser(
    @Query(UserFilterPipe) options: APIMapping.PageOptions & User.FilterOptions
  ) {
    const informations = await this.userService.list(options);

    return JSON.stringify(informations);
  }

  @Post()
  async createUser(@Body(SignUpValidator) payload: User.LogInOptions) {
    const user = await this.userService.create(payload);

    if (!user)
      throw new ConflictException(`Username ${payload.username} has been used`);

    return JSON.stringify(user);
  }

  @Get(":username")
  async getUser(@Param("username") username: string) {
    const information = await this.userService.get(username);

    if (!information)
      throw new NotFoundException(
        `Cannot find the user with the username: ${username}.`
      );

    return JSON.stringify(information);
  }

  @Post(":username")
  async setUser(
    @Param("username") username: string,
    @Body(InformationValidator) options: User.Information
  ) {
    const information = await this.userService.set(options, username);

    if (!information)
      throw new NotFoundException(
        `Cannot find the user with the username: ${username}.`
      );

    return JSON.stringify(information);
  }

  @Delete(":username")
  async deleteUser(@Param("username") username: string) {
    const information = await this.userService.delete(username);

    if (!information)
      throw new NotFoundException(
        `Cannot find the user with the username: ${username}.`
      );

    return JSON.stringify(information);
  }
}

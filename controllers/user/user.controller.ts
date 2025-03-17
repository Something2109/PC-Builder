import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UsernameAuthorizationGuard } from "./user.guard";
import { UserFilterPipe } from "./user.pipe";
import { Role } from "controllers/utils/role/role.decorator";
import { ZodValidationPipe } from "controllers/utils/utils.modules";
import { User } from "@/utils/interface/user/User";
import { APIMapping } from "@/utils/interface/api";
import { Roles } from "@/utils/Enum";

const SignUpValidator = new ZodValidationPipe(User.LogInOptions);
const InformationValidator = new ZodValidationPipe(User.Information.partial());

@UseGuards(UsernameAuthorizationGuard)
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Role(Roles.ADMIN)
  @Get()
  async listUser(
    @Query(UserFilterPipe) options: APIMapping.PageOptions & User.FilterOptions
  ) {
    const informations = await this.userService.list(options);

    return informations;
  }

  @Post()
  async createUser(@Body(SignUpValidator) payload: User.LogInOptions) {
    const user = await this.userService.create(payload);

    if (!user)
      throw new ConflictException(`Username ${payload.username} has been used`);

    return user;
  }

  @Role(Roles.USER)
  @Get(":username")
  async getUser(@Param("username") username: string) {
    const information = await this.userService.get(username);

    if (!information)
      throw new NotFoundException(
        `Cannot find the user with the username: ${username}.`
      );

    return information;
  }

  @Role(Roles.USER)
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

    return information;
  }

  @Role(Roles.USER)
  @Delete(":username")
  async deleteUser(@Param("username") username: string) {
    const information = await this.userService.delete(username);

    if (!information)
      throw new NotFoundException(
        `Cannot find the user with the username: ${username}.`
      );

    return information;
  }
}

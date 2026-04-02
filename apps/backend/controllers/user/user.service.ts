import UserModel, { UserModelScope } from "@/models/user/User.entity";
import * as API from "@/utils/API";
import * as User from "@/utils/user";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class UserService {
  constructor(private readonly sequelize: Sequelize) {}

  async verify({ username, password }: { username: string; password: string }) {
    const user = await UserModel.scope(UserModelScope.VERIFY).findOne({
      where: { username },
    });

    if (!user)
      throw new NotFoundException({
        username: `No username match ${username}`,
      });

    if (user.password !== password)
      throw new UnauthorizedException({
        password: "Password not match",
      });

    const { password: _, ...info } = user.toJSON();

    return info as User.JwtPayload;
  }

  async create({
    username,
    password,
  }: User.LogInOptions): Promise<User.Detail | null> {
    const [user, created] = await UserModel.findOrBuild({
      where: { username },
      defaults: { password },
    });

    if (!created) return null;

    await this.sequelize.transaction(
      async (transaction) => await user.save({ transaction }),
    );

    const { password: _, ...result } = user.toJSON();

    return result;
  }

  async list({
    page,
    limit,
    ...options
  }: User.FilterOptions & API.PageOptions): Promise<User.Information[] | null> {
    const userList = await UserModel.scope(UserModelScope.SUMMARY).findAll({
      where: options,
      offset: (page - 1) * limit,
      limit,
    });

    return userList.map((val) => val.toJSON());
  }

  async get(username: string): Promise<User.Detail | null> {
    const user = await UserModel.scope(UserModelScope.DETAIL).findOne({
      where: { username },
    });

    if (!user) return null;

    return user.toJSON();
  }

  async set(options: User.Information, username: string) {
    const user = await UserModel.findOne({ where: { username } });

    if (!user) return null;

    user.set(options);

    await this.sequelize.transaction(
      async (transaction) => await user.save({ transaction }),
    );

    return user.toJSON();
  }

  async delete(username: string): Promise<User.Information | null> {
    const user = await UserModel.findOne({ where: { username } });

    if (!user) return null;

    await this.sequelize.transaction(
      async (transaction) => await user.destroy({ transaction }),
    );

    return user.toJSON();
  }
}

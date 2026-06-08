import * as bcrypt from "bcrypt";
import {
  Column,
  DataType,
  Default,
  DefaultScope,
  Index,
  IsEmail,
  Model,
  NotNull,
  PrimaryKey,
  Scopes,
  Table,
  BeforeSave,
} from "sequelize-typescript";

import { Type, Roles, FilterOptions } from "@/utils/user";

import { defaultFilter, Tables } from "../interface";

enum UserModelScope {
  VERIFY = "verify",
  SUMMARY = "summary",
  FILTER = "filter",
  DETAIL = "detail",
}

@DefaultScope(() => ({ attributes: { exclude: ["password", "refreshTokenHash"] } }))
@Scopes(() => ({
  [UserModelScope.VERIFY]: () => ({
    attributes: ["id", "username", "password", "role", "refreshTokenHash"],
  }),
  [UserModelScope.SUMMARY]: () => ({
    attributes: ["id", "username", "name", "role"],
  }),
  [UserModelScope.FILTER]: (options: FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [UserModelScope.DETAIL]: () => ({
    attributes: { exclude: ["password", "refreshTokenHash"] },
  }),
}))
@Table({ tableName: Tables.USER })
export default class UserModel extends Model implements Type {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @NotNull
  @Column({ type: DataType.STRING, allowNull: false, validate: { len: [8, 255] } })
  declare username: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false, validate: { len: [8, 255] } })
  declare password: string;

  @Column(DataType.STRING)
  declare refreshTokenHash: string | null;

  @Column(DataType.STRING)
  declare name: string | null;

  @IsEmail
  @Column({ type: DataType.STRING })
  declare email: string | null;

  @Default(Roles.USER)
  @Column({
    type: DataType.STRING,
    validate: { isIn: [Object.values(Roles)] },
  })
  declare role: Roles;
 
  @BeforeSave
  static async hashPassword(instance: UserModel) {
    if (instance.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }
}

export { UserModelScope };

import { defaultFilter, Tables } from "../interface";
import { Type, Roles, FilterOptions } from "@/utils/user";
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
} from "sequelize-typescript";

enum UserModelScope {
  VERIFY = "verify",
  SUMMARY = "summary",
  FILTER = "filter",
  DETAIL = "detail",
}

@DefaultScope(() => ({ attributes: { exclude: ["password"] } }))
@Scopes(() => ({
  [UserModelScope.VERIFY]: () => ({
    attributes: ["id", "username", "password", "role"],
  }),
  [UserModelScope.SUMMARY]: () => ({
    attributes: ["id", "username", "name", "role"],
  }),
  [UserModelScope.FILTER]: (options: FilterOptions) => ({
    where: defaultFilter(options),
  }),
  [UserModelScope.DETAIL]: () => ({
    attributes: { exclude: ["password"] },
  }),
}))
@Table({ tableName: Tables.USER })
class UserModel extends Model implements Type {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index
  @NotNull
  @Column({ type: DataType.STRING, allowNull: false, validate: { min: 8 } })
  declare username: string;

  @NotNull
  @Column({ type: DataType.STRING, allowNull: false, validate: { min: 8 } })
  declare password: string;

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
}

export { UserModel, UserModelScope };

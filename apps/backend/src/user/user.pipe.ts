import { Injectable, PipeTransform } from "@nestjs/common";
import * as API from "@pc-builder/shared/API";
import { Roles } from "@pc-builder/shared/user";
import * as User from "@pc-builder/shared/user";

@Injectable()
export class UserFilterPipe implements PipeTransform {
  transform(value: Record<string, string | string[]>) {
    const result: User.FilterOptions & API.PageOptions = API.toPageOptions(value);

    let role = Array.isArray(value["role"]) ? value["role"] : [value["role"]];
    role = role.filter((val) => Object.values(Roles).includes(val as Roles));

    if (role.length > 0) result.role = role as Roles[];

    return result;
  }
}

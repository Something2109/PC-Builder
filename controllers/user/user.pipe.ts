import { Roles } from "@/utils/Enum";
import { APIMapping } from "@/utils/interface/api";
import { User } from "@/utils/interface/user/User";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UserFilterPipe implements PipeTransform {
  transform(value: Record<string, string | string[]>) {
    const result: User.FilterOptions & APIMapping.PageOptions =
      APIMapping.toPageOptions(value);

    let role = Array.isArray(value["role"]) ? value["role"] : [value["role"]];
    role = role.filter((val) => Object.values(Roles).includes(val as Roles));

    if (role.length > 0) result.role = role as Roles[];

    return result;
  }
}

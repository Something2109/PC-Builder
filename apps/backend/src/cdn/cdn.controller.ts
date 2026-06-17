import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { Role } from "src/utils/role/role.decorator";

import { Roles } from "@/utils/user";

import { CdnService } from "./cdn.service";

@Controller("media")
export class CdnController {
  constructor(private readonly cdnService: CdnService) {}

  @Role(Roles.ADMIN, Roles.GUEST)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: any, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    return this.cdnService.saveUpload(file, req);
  }
}

import { Tokens } from "@pc-builder/shared/API";
import { Request } from "express";

function getAccessToken(request: Request) {
  return request.cookies?.[Tokens.ACCESS] ?? "";
}

function getRefreshToken(request: Request) {
  return request.cookies?.[Tokens.REFRESH] ?? "";
}

export { getAccessToken, getRefreshToken };

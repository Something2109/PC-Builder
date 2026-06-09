import { Request } from "express";

import { Tokens } from "@/utils/API";

function getAccessToken(request: Request) {
  return request.cookies[Tokens.ACCESS];
}

function getRefreshToken(request: Request) {
  return request.cookies[Tokens.REFRESH];
}

export { getAccessToken, getRefreshToken };

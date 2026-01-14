import { Request } from "express";

const ACCESS_TOKEN_COOKIE_NAME = "Access_Token";
const REFRESH_TOKEN_COOKIE_NAME = "Refresh_Token";

function getAccessToken(request: Request) {
  return request.cookies[ACCESS_TOKEN_COOKIE_NAME];
}

function getRefreshToken(request: Request) {
  return request.cookies[REFRESH_TOKEN_COOKIE_NAME];
}

export {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  getAccessToken,
  getRefreshToken,
};

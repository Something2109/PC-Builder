import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { Tokens } from "@pc-builder/shared/API";
import { UserService } from "src/user/user.service";

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let userService: any;
  let jwtService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            verify: jest.fn(),
            setRefreshToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signUp", () => {
    it("should successfully sign up a user", async () => {
      const username = "newuser";
      const password = "password123";
      const mockUser = { username, role: "user" };
      const mockTokens = { access_token: "access", refresh_token: "refresh" };

      userService.create.mockResolvedValue(mockUser);
      userService.verify.mockResolvedValue(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce(mockTokens.access_token)
        .mockResolvedValueOnce(mockTokens.refresh_token);

      const result = await service.signUp(username, password);

      expect(userService.create).toHaveBeenCalledWith({ username, password });
      expect(userService.verify).toHaveBeenCalledWith({ username, password });
      expect(userService.setRefreshToken).toHaveBeenCalledWith(username, mockTokens.refresh_token);
      expect(result).toEqual({ user: mockUser, tokens: mockTokens });
    });

    it("should throw ConflictException if username is already in use", async () => {
      const username = "existinguser";
      const password = "password123";

      userService.create.mockResolvedValue(null);

      await expect(service.signUp(username, password)).rejects.toThrow(ConflictException);
      expect(userService.create).toHaveBeenCalledWith({ username, password });
      expect(userService.verify).not.toHaveBeenCalled();
    });
  });

  describe("logIn", () => {
    it("should successfully log in a user", async () => {
      const username = "user1";
      const password = "password123";
      const mockUser = { username, role: "user" };
      const mockTokens = { access_token: "access", refresh_token: "refresh" };

      userService.verify.mockResolvedValue(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce(mockTokens.access_token)
        .mockResolvedValueOnce(mockTokens.refresh_token);

      const result = await service.logIn(username, password);

      expect(userService.verify).toHaveBeenCalledWith({ username, password });
      expect(userService.setRefreshToken).toHaveBeenCalledWith(username, mockTokens.refresh_token);
      expect(result).toEqual({ user: mockUser, tokens: mockTokens });
    });
  });

  describe("refresh", () => {
    it("should successfully refresh tokens with a valid refresh token", async () => {
      const rawRefreshToken = "Bearer valid_refresh_token";
      const payload = { sub: { username: "user1", role: "user" }, type: Tokens.REFRESH };
      const mockTokens = { access_token: "new_access", refresh_token: "new_refresh" };

      jwtService.verifyAsync.mockResolvedValue(payload);
      userService.verifyRefreshToken.mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce(mockTokens.access_token)
        .mockResolvedValueOnce(mockTokens.refresh_token);

      const result = await service.refresh(rawRefreshToken);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith("valid_refresh_token");
      expect(userService.verifyRefreshToken).toHaveBeenCalledWith("user1", "valid_refresh_token");
      expect(userService.setRefreshToken).toHaveBeenCalledWith("user1", mockTokens.refresh_token);
      expect(result).toEqual({ user: payload.sub, tokens: mockTokens });
    });

    it("should throw UnauthorizedException and clear refresh token if refresh token validation fails", async () => {
      const rawRefreshToken = "Bearer invalid_refresh_token";
      const payload = { sub: { username: "user1", role: "user" }, type: Tokens.REFRESH };

      jwtService.verifyAsync.mockResolvedValue(payload);
      userService.verifyRefreshToken.mockResolvedValue(false);

      await expect(service.refresh(rawRefreshToken)).rejects.toThrow(
        new UnauthorizedException("Invalid Refresh Token")
      );
      expect(userService.setRefreshToken).toHaveBeenCalledWith("user1", null);
    });

    it("should throw UnauthorizedException if token type is not REFRESH", async () => {
      const rawRefreshToken = "Bearer access_token_by_mistake";
      const payload = { sub: { username: "user1", role: "user" }, type: Tokens.ACCESS };

      jwtService.verifyAsync.mockResolvedValue(payload);

      await expect(service.refresh(rawRefreshToken)).rejects.toThrow(
        new UnauthorizedException("Invalid Refresh Token")
      );
    });

    it("should throw TokenExpiredError translation on expiration", async () => {
      const rawRefreshToken = "Bearer expired_token";
      const expiredError = new Error("Token expired");
      expiredError.name = "TokenExpiredError";

      jwtService.verifyAsync.mockRejectedValue(expiredError);

      await expect(service.refresh(rawRefreshToken)).rejects.toThrow(
        new UnauthorizedException("Refresh Token Expired")
      );
    });

    it("should throw generic invalid token on other errors", async () => {
      const rawRefreshToken = "Bearer invalid_token";
      jwtService.verifyAsync.mockRejectedValue(new Error("Signature validation failed"));

      await expect(service.refresh(rawRefreshToken)).rejects.toThrow(
        new UnauthorizedException("Invalid Refresh Token")
      );
    });
  });

  describe("logOut", () => {
    it("should call userService.setRefreshToken with null", async () => {
      const username = "user1";
      await service.logOut(username);
      expect(userService.setRefreshToken).toHaveBeenCalledWith(username, null);
    });
  });
});

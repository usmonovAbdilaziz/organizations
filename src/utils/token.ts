import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { errorResponse } from "./response";
import { config } from "src/config/config.env";
import { TokenPayload } from "src/types/token";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  // Backwards-compatible methods (delegates)
  async accessToken(payload: TokenPayload) {
    return this.generateAccessToken(payload);
  }

  async refreshToken(payload: TokenPayload) {
    return this.generateRefreshToken(payload);
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      errorResponse(error);
      throw error;
    }
  }

  // New, clearer API
  generateAccessToken(payload: TokenPayload): string {
    try {
      return this.jwtService.sign(payload, {
        secret: config.accessSecret,
        expiresIn: config.accessTime as any,
      });
    } catch (error) {
      errorResponse(error);
      throw error;
    }
  }

  generateRefreshToken(payload: TokenPayload): string {
    try {
      return this.jwtService.sign(payload, {
        secret: config.refreshSecret,
        expiresIn: config.refreshTime as any,
      });
    } catch (error) {
      errorResponse(error);
      throw error;
    }
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token, { secret: config.accessSecret }) as TokenPayload;
    } catch (error) {
      errorResponse(error);
      throw error;
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token, { secret: config.refreshSecret }) as TokenPayload;
    } catch (error) {
      errorResponse(error);
      throw error;
    }
  }

}
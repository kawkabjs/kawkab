import jwt from "jsonwebtoken";
import crypto from 'crypto';

export class JWT {
  private readonly secretKey: string;
  private readonly refreshSecretKey: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor(
    accessTokenExpiry: string = "2h",
    refreshTokenExpiry: string = "1h"
  ) {
    this.secretKey = crypto.randomBytes(64).toString('hex');
    this.refreshSecretKey = crypto.randomBytes(64).toString('hex');
    this.accessTokenExpiry = accessTokenExpiry;
    this.refreshTokenExpiry = refreshTokenExpiry;
  }

  /**
   * Generate both access and refresh tokens
   */
  public generate(payload: {}) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getExpirationTime(this.accessTokenExpiry),
    };
  }

  /**
   * Generate access token
   */
  private generateAccessToken(payload: {}): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(payload: {}): string {
    return jwt.sign(payload, this.refreshSecretKey, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  /**
   * Verify access token
   */
  public verify(token: string): {} | null {
    try {
      return jwt.verify(token, this.secretKey) as {};
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  public verifyRefreshToken(token: string): {} | null {
    try {
      return jwt.verify(token, this.refreshSecretKey) as {};
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode token without verification
   */
  public decodeToken(token: string): {} | null {
    try {
      return jwt.decode(token) as {};
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  public refresh(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    if (payload === null) {
      return null;
    }
    return this.generate(payload);
  }

  /**
   * Extract token from authorization header
   * @param authHeader The authorization header string
   * @returns The extracted token or null if invalid
   * @throws Error if the header is malformed
   */
  public extract(authHeader: string): string | null {
    if (!authHeader) {
      return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
      return null;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      return null;
    }

    const token = parts[1];
    if (!token || token.trim().length === 0) {
      return null;
    }

    return token;
  }

  /**
   * Calculate expiration time in seconds
   */
  private getExpirationTime(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));

    switch (unit) {
      case "s":
        return value;
      case "m":
        return value * 60;
      case "h":
        return value * 60 * 60;
      case "d":
        return value * 24 * 60 * 60;
      case "w":
        return value * 7 * 24 * 60 * 60;
      case "M":
        return value * 30 * 24 * 60 * 60;
      case "y":
        return value * 365 * 24 * 60 * 60;
      default:
        return 3600;
    }
  }
}

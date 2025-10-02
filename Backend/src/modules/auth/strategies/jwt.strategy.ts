import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import * as jwt from "jsonwebtoken";
import * as jwksClient from "jwks-rsa";

export interface JwtPayload {
  sub: string; // Keycloak user ID
  preferred_username: string;
  email: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private jwksClient: jwksClient.JwksClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    const keycloakUrl =
      configService.get<string>("KEYCLOAK_AUTH_SERVER_URL") ||
      "http://localhost:9090";
    const realm = configService.get<string>("KEYCLOAK_REALM") || "lorawan";

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        // Initialize JWKS client for Keycloak
        const jwksClientInstance = jwksClient({
          jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
          cache: true,
          cacheMaxAge: 600000, // 10 minutes
          rateLimit: true,
          jwksRequestsPerMinute: 5,
        });

        this.getKeycloakPublicKey(rawJwtToken, done, jwksClientInstance);
      },
    });

    // Initialize JWKS client for Keycloak
    this.jwksClient = jwksClient({
      jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      cacheMaxAge: 600000, // 10 minutes
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });
  }

  private getKeycloakPublicKey(
    token: string,
    done: (err: any, key?: string) => void,
    jwksClientInstance?: jwksClient.JwksClient
  ) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header.kid) {
        return done(new Error("Unable to find kid in token header"));
      }

      const client = jwksClientInstance || this.jwksClient;
      client.getSigningKey(decoded.header.kid, (err, key) => {
        if (err) {
          return done(err);
        }
        const signingKey = key?.getPublicKey();
        done(null, signingKey);
      });
    } catch (error) {
      done(error);
    }
  }

  async validate(payload: JwtPayload) {
    // Find or create user in our database
    const user = await this.authService.validateUser(payload);
    return user;
  }
}

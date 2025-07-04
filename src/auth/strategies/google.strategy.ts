import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
      super({
        clientID: process.env.GOOGLE_ID_CLIENT,
        clientSecret: process.env.GOOGLE_SECRET_CLIENT,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['email', 'profile'],
      });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName,
      lastName: name.familyName,
      googleId: id,
      provider: 'google',
    };

    // esta propiedad lo toma el @Req() del controlador
    done(null, user);
    
  }

  
}
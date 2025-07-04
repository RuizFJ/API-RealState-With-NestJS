import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    
    return activate as boolean;
    
  }
  
}
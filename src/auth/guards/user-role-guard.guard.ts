import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../users/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Get the roles metadata from the route handler, which is set by the RoleProtected decorator
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    /*this is used to get the request object from the context
    and then get the user from the request object*/
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new BadRequestException('user not found');
    }

    /*If no roles are defined, allow access
    This is useful for public routes or routes that don't require specific roles*/
    if (!validRoles) {
      return true;
    }
    // If validRoles is an empty array, allow access
    if (validRoles.length === 0) {
      return true;
    }

    // and then check if the user has any of the valid roles
    for (const role of user.roles) {
      
      if(validRoles.includes(role)){
        return true
      }
    }

    /*for (const role of validRoles) {
      if (role === user.role) {
        return true;
      }
    }*/

    throw new ForbiddenException('User need a valid role');
  }
}

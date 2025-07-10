import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { UserRole } from "src/common/enums/user-role.enum";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role-guard.guard";


/**
 * Decorator to protect routes with user roles.
 * It sets the required roles and applies the necessary guards.
 * 
 * @param roles - The roles that are allowed to access the route.
 */
export function Auth(...roles: UserRole[]){
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard('jwt'), UserRoleGuard)

    )
}
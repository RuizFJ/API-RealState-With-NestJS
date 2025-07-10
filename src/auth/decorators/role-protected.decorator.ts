import { SetMetadata } from "@nestjs/common"
import { UserRole } from "src/common/enums/user-role.enum"

export const META_ROLES = 'roles'

export const RoleProtected = (...args: UserRole[]) => {


    // This decorator is used to set metadata for roles that are required to access certain routes.
    return SetMetadata(META_ROLES, args)
}
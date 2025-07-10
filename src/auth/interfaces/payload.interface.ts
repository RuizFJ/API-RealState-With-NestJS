import { UserRole } from "src/common/enums/user-role.enum";

export interface PayloadInterface {
    sub: string;
    email: string;
    name:string;
    role: UserRole
}
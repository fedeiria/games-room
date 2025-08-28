import { UserRole } from "../../enums/user-role.enum";

export interface Iuser {
    email: string;
    name: string;
    surname: string;
    enabled: boolean;
    roleId: UserRole.User;
}

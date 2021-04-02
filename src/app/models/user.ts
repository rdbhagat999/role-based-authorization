import { Role } from "@models/role.enum";

export class User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: Role = Role.USER;
  token?: string;
}

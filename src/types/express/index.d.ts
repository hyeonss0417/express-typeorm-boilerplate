import { User } from "../../entity/User";

declare global {
  namespace Express {
    export interface Request {
      token: {
        id: string;
      };
      currentUser: Omit<User, "password" | "salt">;
    }
  }
}

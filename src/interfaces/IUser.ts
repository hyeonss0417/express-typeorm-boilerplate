import { User } from "../entity/User";

export interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}

export type IUserViewDTO = Omit<User, "password" | "salt">;

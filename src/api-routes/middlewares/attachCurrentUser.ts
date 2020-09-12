import { Request, NextFunction, Response } from "express";
import Container from "typedi";
import { Repository } from "typeorm";
import { User } from "../../entity/User";
import { CustomError } from "../../utils/CustomError";
import * as _ from "lodash";

const attachCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepository = Container.get("userRepository") as Repository<User>;
  const user = await userRepository.findOne(req.token.id);
  if (!user) {
    return next(new CustomError("INVALID_TOKEN", 401, "Invalid token."));
  }
  req.currentUser = _.omit(user, ["password", "salt"]);
  next();
};

export default attachCurrentUser;

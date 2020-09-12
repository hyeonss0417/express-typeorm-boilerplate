import { Service, Inject } from "typedi";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "express-jwt";
import * as argon2 from "argon2";
import * as _ from "lodash";

import {
  EventDispatcher,
  EventDispatcherInterface,
} from "../decorators/eventDispatcher";
import config from "../config";
import { IUserInputDTO, IUserViewDTO } from "../interfaces/IUser";
import { randomBytes } from "crypto";

@Service()
export default class AuthService {
  constructor(
    @Inject("userRepository") private userRepository: Repository<User>, //private mailer: MailerService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {}

  public async SignUp(
    userInputDTO: IUserInputDTO
  ): Promise<{ user: IUserViewDTO; token: string }> {
    const salt = randomBytes(32);
    const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
    const user = await this.userRepository.create({
      ...userInputDTO,
      salt: salt.toString("hex"),
      password: hashedPassword,
    });
    if (!user) {
      throw Error("User cannot be created.");
    }
    const token = this.generateToken(user);
    //await this.mailer.SendWelcomeEmail(user);
    //this.eventDispatcher.dispatch(events.user.signUp, {user});

    /**
     * @TODO This is not the best way to deal with this
     * There should exist a 'Mapper' layer
     * that transforms data from layer to layer
     * but that's too over-engineering for now
     */
    return { user: _.omit(user, ["password", "salt"]), token };
  }

  public async SignIn(
    email: string,
    password: string
  ): Promise<{ user: IUserViewDTO; token: string }> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new Error("User not registred");
    }

    // We use verify from argon2 to prevent 'timing based' attacks
    const validPassword = await argon2.verify(user.password, password);
    if (validPassword) {
      const token = this.generateToken(user);
      return { user: _.omit(user, ["password", "salt"]), token };
    } else {
      throw new Error("Invalid Password");
    }
  }

  private generateToken(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}

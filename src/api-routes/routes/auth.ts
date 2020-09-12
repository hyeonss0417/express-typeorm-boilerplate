import { Router, Request, Response, NextFunction } from "express";
import middlewares from "../middlewares";
import Container from "typedi";
import { Logger } from "winston";
import AuthService from "../../services/auth";
import { IUserInputDTO } from "../../interfaces/IUser";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/signup",
    middlewares.validators.signUp,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get("logger") as Logger;
      logger.debug("Calling Sign-up endpoint with body: %o", req.body);
      try {
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignUp(
          req.body as IUserInputDTO
        );
        return res.status(201).json({ user, token });
      } catch (err) {
        next(err);
      }
    }
  );

  route.post(
    "/signin",
    middlewares.validators.signIn,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get("logger") as Logger;
      logger.debug("Calling Sign-In endpoint with body: %o", req.body);
      try {
        const { email, password } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const { user, token } = await authServiceInstance.SignIn(
          email,
          password
        );
        return res.status(200).json({ user, token });
      } catch (err) {
        next(err);
      }
    }
  );

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  route.post(
    "/logout",
    middlewares.isAuth,
    (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get("logger") as Logger;
      logger.debug("Calling Logout endpoint with body: %o", req.body);
      try {
        return res.status(200).end();
      } catch (err) {
        next(err);
      }
    }
  );
};

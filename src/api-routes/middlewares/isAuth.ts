import jwt from "express-jwt";
import { Request } from "express";
import config from "../../config";

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 */
const getTokenFromHeader = (req: Request) => {
  const auth = req.headers.authorization;
  /**
   * @TODO handle Edgs and Explorer cases
   */
  if (
    (auth && auth.split(" ")[0] === "Token") ||
    (auth && auth.split(" ")[0] === "Bearer")
  ) {
    return auth.split(" ")[1];
  }
  return null;
};

const isAuth = jwt({
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  userProperty: "token", // Use req.token to store the JWT
  getToken: getTokenFromHeader, //How to extract the JWT from the request
});

export default isAuth;

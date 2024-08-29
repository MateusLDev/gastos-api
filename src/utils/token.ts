import { jwtDecode } from "jwt-decode";
// dar um trow error se nao tiver token
export const getTokenByAuthorizationString = (authorization: string) => authorization.replace(/^Bearer /, "")

export const getUserIdByToken = (token: string) => jwtDecode(token).sub
import { jwtDecode } from "jwt-decode";

export const getTokenByAuthorizationString = (authorization: string) => authorization.replace(/^Bearer /, "")

export const getUserIdByToken = (token: string) => jwtDecode(token).sub
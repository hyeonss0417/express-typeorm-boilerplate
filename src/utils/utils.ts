import { NextFunction } from "express";
import Logger from "../loaders/logger";

export const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;

export function isUrlFormat(url) {
  return urlRegex.test(url);
}

export function generateRandomKey(
  length: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 10
) {
  return Math.random()
    .toString(36)
    .substr(2, length + 2);
}

export function passErrorToNext(callback: any, next: NextFunction) {
  try {
    callback();
  } catch (e) {
    Logger.error("🔥 error: %o", e);
    return next(e);
  }
}

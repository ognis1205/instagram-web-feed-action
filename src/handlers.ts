/**
 * @fileoverview Defines handle.
 * @copyright Shingo OKAWA 2022
 */
import * as Actions from "@actions/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasMessage = (e: any): e is { message: string } => {
  if ("message" in e)
    return true;
  return false;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onError = (e: any): void => {
  if (hasMessage(e))
    Actions.setFailed(e.message);
  else
    Actions.setFailed(e as Error);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onWarning = (e: any): void => {
  if (hasMessage(e))
    Actions.warning(e.message);
  else
    Actions.warning(e as Error);
};

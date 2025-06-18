import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const MAX_NAME_LENGTH = 50;
const EMAIL_DISPLAY_REGEX = /(.{3}).*?(@.{3}).*/;
export const formatWorkspaceName = (name: string) =>
    name.length > MAX_NAME_LENGTH
      ? `${name.substring(0, MAX_NAME_LENGTH)}...`
      : name;

export const formatUserName = (name: string | undefined) => {
    if (!name) return null;

    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastNameInitial = nameParts[1] ? ` ${nameParts[1].charAt(0)}.` : ".";

    return `${firstName.length > 10 ? `${firstName.substring(0, 10)}...` : firstName}${lastNameInitial}`;
  };

export const formatUserEmail = (email: string | undefined) =>
    email ? email.replace(EMAIL_DISPLAY_REGEX, "$1...$2") : "";

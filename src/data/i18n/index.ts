import { en } from "./en";
import { ar } from "./ar";
import type { Dictionary, Lang } from "./types";

export const LANGS: Lang[] = ["en", "ar"];

export const dictionaries: Record<Lang, Dictionary> = { en, ar };

export type { Dictionary, Lang } from "./types";

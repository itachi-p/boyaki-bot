import { kansaiPrompt } from './kansai';
import { nekojinPrompt } from './nekojin';
import { roujinPrompt } from './roujin';
import { downerPrompt } from './downer';

export const prompts = {
  kansai: kansaiPrompt,
  nekojin: nekojinPrompt,
  roujin: roujinPrompt,
  downer: downerPrompt,
} as const;

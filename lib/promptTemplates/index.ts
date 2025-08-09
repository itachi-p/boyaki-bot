import { kansaiPrompt } from './kansai';
import { nekojinPrompt } from './nekojin';
import { roujinPrompt } from './roujin';
import { downerPrompt } from './downer';
import { nishioPrompt } from './nishioishin';

export const prompts = {
  kansai: kansaiPrompt,
  nekojin: nekojinPrompt,
  roujin: roujinPrompt,
  downer: downerPrompt,
  nishio: nishioPrompt,
} as const;

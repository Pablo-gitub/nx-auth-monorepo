import daisyui from 'daisyui';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import { join } from 'path';

export default {
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
};

import type { Config } from 'tailwindcss';
import { lightColors, darkColors } from '../../packages/ui/src/theme';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...lightColors,
        dark: darkColors,
      },
      boxShadow: {
        'neumorphic-outset': `4px 4px 8px ${lightColors.neumorphic.outset.shadow}, -4px -4px 8px ${lightColors.neumorphic.outset.highlight}`,
        'neumorphic-inset': `inset 4px 4px 8px ${lightColors.neumorphic.inset.shadow}, inset -4px -4px 8px ${lightColors.neumorphic.inset.highlight}`,
        'dark-neumorphic-outset': `4px 4px 8px ${darkColors.neumorphic.outset.shadow}, -4px -4px 8px ${darkColors.neumorphic.outset.highlight}`,
        'dark-neumorphic-inset': `inset 4px 4px 8px ${darkColors.neumorphic.inset.shadow}, inset -4px -4px 8px ${darkColors.neumorphic.inset.highlight}`,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
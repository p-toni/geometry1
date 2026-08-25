import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type CEProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'thinking-orb': CEProps & {
        size?: string;
        theme?: 'light' | 'dark' | string;
        speed?: string;
        paused?: string;
      };
      'signal-mark': CEProps & {
        kind?: string;
        size?: string;
        accent?: string;
        label?: string;
      };
      'plate-lattice': CEProps & {
        ink?: string;
        accent?: string;
        amp?: string;
        speed?: string;
        threshold?: string;
      };
    }
  }
}

export {};

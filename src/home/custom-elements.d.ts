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
      'field-hero': CEProps & {
        bg?: string;
        ground?: string;
        ink?: string;
        edge?: string;
        accent?: string;
        fit?: string;
        labels?: string;
      };
      'asciify-lens': CEProps & {
        src?: string;
        alt?: string;
        charset?: string;
        scale?: string;
        spacing?: string;
        radius?: string;
        softness?: string;
        background?: string;
        'background-opacity'?: string;
        contrast?: string;
        effect?: string;
      };
      'particle-scroll': CEProps & {
        point?: string;
        band?: string;
        spread?: string;
        gravity?: string;
        drift?: string;
        swirl?: string;
        stagger?: string;
        settle?: string;
        smoothing?: string;
        effect?: string;
        'start-at'?: string;
      };
    }
  }
}

export {};

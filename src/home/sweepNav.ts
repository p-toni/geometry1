import { useGlimm } from 'glimm/react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Paper → signal, driven by hand.
 *
 * `glimm/react` has no link interception — that ships only in the Next adapter — so
 * the provider does nothing until a click drives it. This is the driver: it returns a
 * click handler that plays the band, swaps the route at the midpoint, and leaves every
 * affordance a plain link has (new tab, new window, save) to the browser.
 *
 * Works on `<a href>` and on react-router `<Link>` alike: both stand down once the
 * event is defaultPrevented, which happens before the sweep starts.
 */
export function useSweepNav() {
  const navigate = useNavigate();
  const { sweep } = useGlimm();

  return (to: string, direction: 'ltr' | 'rtl' = 'ltr') =>
    (event: MouseEvent<HTMLAnchorElement>) => {
      // A modified click is the reader asking for a tab, a window, or a file.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      sweep(
        () => {
          navigate(to);
        },
        { direction },
      );
    };
}

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { tween } from '../../design/motion';
import { cn } from '../../lib/cn';
import { slugToPath } from '../../lib/paths';
import type { BlockRendererProps } from './types';

export function Link({ item }: BlockRendererProps) {
  const navigate = useNavigate();
  const isCompact = item.rows <= 3 || item.cols <= 8;

  return (
    <motion.button
      type="button"
      data-no-drag="true"
      className={cn(
        'group flex h-full w-full flex-col rounded-[6px] border border-ink/10 bg-paper/50 text-left transition hover:border-accent-ink',
        isCompact ? 'justify-end px-2 pb-2 pt-1' : 'justify-end p-3',
      )}
      whileHover={{ y: -2 }}
      transition={tween.hover}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        navigate(slugToPath(item.content));
      }}
    >
      <span
        className={cn(
          'max-w-full truncate font-display leading-none tracking-normal',
          isCompact ? 'text-[16px]' : 'text-[24px]',
        )}
        style={{ fontVariationSettings: `'opsz' 72, 'SOFT' 30, 'WONK' 1` }}
      >
        {item.label}
      </span>
      <span className={cn('h-px w-full origin-left scale-x-0 bg-accent-ink transition-transform duration-150 group-hover:scale-x-100', isCompact ? 'mt-1' : 'mt-2')} />
      <span
        className={cn(
          'max-w-full truncate font-mono uppercase tracking-[0.12em] text-ink-2',
          isCompact ? 'mt-1 text-[8px]' : 'mt-2 text-[10px]',
        )}
      >
        {item.content === 'home' ? '/' : item.content}
      </span>
    </motion.button>
  );
}

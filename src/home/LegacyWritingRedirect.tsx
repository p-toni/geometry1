import { Navigate, useParams } from 'react-router-dom';

/**
 * `/writing/:id` was the sheet-over-home reader. Essays now have one reader at the
 * canonical `/read/:id`, which the sitemap and feed have always pointed at.
 */
export function LegacyWritingRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/read/${id}` : '/'} replace />;
}

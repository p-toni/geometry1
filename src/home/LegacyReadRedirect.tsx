import { Navigate, useParams } from 'react-router-dom';
import { readPath } from '../lib/legacyRoutes';

/**
 * Old addresses for the same essay: the sheet at `/writing/:id`, and `/read/:id/full`
 * from when the reader had an excerpt/full split.
 */
export function LegacyReadRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? readPath(id) : '/'} replace />;
}

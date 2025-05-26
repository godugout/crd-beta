
// Re-export the useAuth from AuthProvider to maintain compatibility
export { useAuth } from './AuthProvider';
export default { useAuth: () => import('./AuthProvider').then(m => m.useAuth) };

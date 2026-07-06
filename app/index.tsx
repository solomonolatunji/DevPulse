import { InitialLoader } from '@/components/InitialLoader';
import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return <InitialLoader />;
  }

  return (
    <>
      <InitialLoader />
      {isAuthenticated ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/auth" />
      )}
    </>
  );
}

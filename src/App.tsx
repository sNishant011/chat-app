import { lazy, Suspense } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import FullScreenSpinner from "./components/FullScreenSpinner";
import { auth } from "./configs/firebase";

const LazyChat = lazy(() => import("./pages/Chat"));
const LazySignIn = lazy(() => import("./pages/SignIn"));

const App = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return <FullScreenSpinner />;
  }
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      {user ? <LazyChat /> : <LazySignIn />}
    </Suspense>
  );
};

export default App;

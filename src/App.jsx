import { RouterProvider, useRoute } from "./lib/router";
import Landing from "./pages/Landing";
import Studio from "./pages/Studio";

function Routes() {
  const { path } = useRoute();
  if (path === "/studio" || path.startsWith("/studio")) return <Studio />;
  return <Landing />;
}

export default function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  );
}

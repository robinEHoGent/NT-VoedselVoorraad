import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App({ children }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" />
      {/* rmove this for production or someone add a if statement if this is development or production */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

interface AppProps {
  children: React.ReactNode;
}

export default App;

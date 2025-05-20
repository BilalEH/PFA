import { RouterProvider } from "react-router-dom";
import { Router} from "./routes";
import { AuthProvider } from "./apiConfig/user";

function App() {
  return(
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  )
}

export default App; 
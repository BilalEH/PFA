import { RouterProvider } from "react-router-dom";
import { Router} from "./routes";
import { AuthProvider } from "./apiConfig/user";
import { Toaster } from 'react-hot-toast';
function App() {
  return(
    <AuthProvider>
      <Toaster position="top-center" />
      <RouterProvider router={Router} />
    </AuthProvider>
  )
}

export default App;
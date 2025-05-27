import { RouterProvider } from "react-router-dom";
import { Router} from "./routes";
import { AuthProvider } from "./apiConfig/user";
import toast, { Toaster } from 'react-hot-toast';
const toast_configure={
  position: "bottom-right",
  autoFocus: true,
  closeButton: true,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};
function App() {
  return(
    <AuthProvider>
      <Toaster position="top-center" toastOptions={toast_configure} />
      <RouterProvider router={Router} />
    </AuthProvider>
  )
}

export default App;
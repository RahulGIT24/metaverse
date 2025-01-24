import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import useAuth, { isAuthorized } from "./hooks/useAuth"
import AdminMapEditor from "./pages/Admin/AdminMapEditor"

const RoleBasedAccess = ({allowedRoles, redirectPath = "/login"}:{allowedRoles:any,redirectPath:any})=>{
  const user = useAuth();
  const location = useLocation(); 
  if(!user){
    return <Navigate to={redirectPath}/>
  }
  if(!allowedRoles.includes(user.role) || !isAuthorized(user.role,location.pathname)){
    return <Navigate to={"/unauthorized"}/>
  }
  return <Outlet/>
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/edit-map" element={<AdminMapEditor/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
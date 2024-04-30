import { Outlet } from "react-router-dom";
import Navbar from "@/components/layouts/Navbar";

const Layout = () => {
  return(
    <>
      <Navbar></Navbar>
      <div className=" bg-green-400 h-full pt-16">
        <Outlet />
      </div>
    </>
  )
}

export default Layout

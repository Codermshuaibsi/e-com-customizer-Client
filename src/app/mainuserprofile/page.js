"use client";
import Navbar from "../COMMON/Navbar";

const { default: UserProfilePage } = require("./userProfileuuuu/page");


   function UserDetailPage() {       
return(
    <>
    <Navbar />
    <UserProfilePage /> 
    
    </>
)

   }

   export default UserDetailPage;
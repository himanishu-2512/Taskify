"use client"
import { Button } from "@/components/ui/button";import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState } from '@/redux/authSlice'
import Image from "next/image";
import Link from "next/link";
import {checkAuth} from "@/redux/authSlice"
import { usePathname, useRouter } from "next/navigation";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName=usePathname()
  const isLogin=pathName==="/login";

  const dispatch=useDispatch();
  const { isAuthenticated } = useSelector(selectAuthState);
  const [isLoading, setIsLoading] = useState(true);
  const router=useRouter();

  useEffect(()=>{
    dispatch(checkAuth());
  },[])

  useEffect(() => {
      // Make sure the code runs only on the client-side
      if (isAuthenticated) {
        router.push("/home")
       // Redirect to login page if not authenticated
      } else {
        setIsLoading(false)
       // Authentication state is checked, stop loading
      }
    
  }, [isAuthenticated,router]);

  // Show loading spinner while checking the authentication state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // You can replace with a spinner or any loading indicator
  }
    
  return (
    <div className="flex h-[100vh] flex-col items-center bg-neutral-100">
    <div className="w-[100%] flex justify-between bg-neutral-100 px-[20px] py-[15px] shadow-md">
        <div className="text-[26px] text-blue-600 font-[600]"><Image alt="Taskify" width={"300"} height={"50"}  src={"./logo.svg"}></Image></div>
        <Button className="px-[20px]" variant={"primary"} ><Link href={isLogin?"/signup":"/login"}>{isLogin?'SignUp':'Login'}</Link></Button>
    </div>
    <div className="flex flex-col justify-center items-center w-[100%] flex-1">
        {children}
    </div>
    </div>
  );
}

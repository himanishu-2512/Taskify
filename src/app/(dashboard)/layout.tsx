"use client"; // Ensure this component is rendered client-side

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/authSlice";
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";



export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router=useRouter();
  const dispatch=useDispatch();
  const name=localStorage.getItem('name')
  return (
          <div className="flex h-[100vh] flex-col items-center bg-neutral-100">
      <div className="w-[100%] flex justify-between bg-neutral-100 px-[20px] py-[15px] shadow-md">
        <div className="text-[26px] text-blue-600 font-[600]">
          <Image alt="Taskify" width={"300"} height={"50"} src="/logo.svg" />
        </div>
        <Avatar className="mr-[20px]">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-blue-600 text-white rounded-full">CN</AvatarFallback>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className="font-normal">{name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-[10px] py-[8px]" onClick={()=>router.push("/home")}>My organizations</DropdownMenuItem>
              <DropdownMenuItem className="px-[10px] py-[8px]" onClick={()=>{dispatch(logout());router.push("/login") }}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Avatar>
      </div>
      <div className="flex flex-col justify-center items-center w-[100%] flex-1">
        {children}
      </div>
    </div>
  );
}

"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postRequest } from '@/utils/apiUtils';
import { API_ENDPOINTS } from '@/constants/apiEndPointsConstant';
import { useRouter } from 'next/navigation';

// Zod schema for validation
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// TypeScript types from the schema
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function Page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router=useRouter();

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Form submission handler
  const onSubmit =async (data: SignUpFormValues) => {
    console.log("Sign Up Data:", data);
    // Handle sign-up logic here (e.g., API calls)
    try {
      // console.log("Login Data:", data);
      const response=await postRequest(API_ENDPOINTS.AUTH.SIGNUP,{},{},data);
      if(response&&response?.data&&response?.data?.message){
      alert(response?.data?.message||"Successful")}
      router.push("/login")
  } catch (error:any) {
    if(error?.response&&error.response?.data&&error?.response?.data?.message){
    alert(error?.response?.data?.message||"An Error Occured")
  }
  }

  };

  return (
    <Card className="w-full h-fit md:w-[400px] flex justify-center items-center shadow-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-w-[300px] flex-col justify-between gap-[15px]"
      >
        <CardHeader className="flex items-center justify-center text-center p-7">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            By signing up, you agree to our{" "}
            <Link className="text-blue-600" href={"/privacy-policy"}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="text-blue-600" href={"/terms-and-conditions"}>
              Terms & Services
            </Link>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-[30px]">
          {/* Name Input */}
          <div>
            <Input
              placeholder="Enter your Name"
              type="text"
              {...register("name")}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div>
            <Input
              placeholder="Enter your Email address"
              type="email"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Input
              placeholder="Enter your Password"
              type={isPasswordVisible ? "text" : "password"}
              {...register("password")}
            />
            <div
              className="absolute top-6 translate-y-[-50%] right-[10px] cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? (
                <FaEyeSlash className="h-[20px] w-auto" />
              ) : (
                <FaEye className="h-[20px] w-auto" />
              )}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="relative top-[40px] flex flex-col gap-[10px] items-center">
            <Button type="submit" className="primary w-full">
              Sign Up
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-7 w-full flex text-center">
          <div className="text-[14px] text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600">
              Click Here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

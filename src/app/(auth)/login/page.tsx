"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { postRequest } from '@/utils/apiUtils';
import { API_ENDPOINTS } from '@/constants/apiEndPointsConstant';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/authSlice';
import { useRouter } from 'next/navigation';  // Import useRouter for redirection

// Define the Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Infer TypeScript types from Zod schema
type LoginFormValues = z.infer<typeof loginSchema>;

export default function Page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();  // Initialize useRouter for navigation

  // Initialize the useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // Use Zod schema for validation
  });

  // Handle form submission
  const onSubmit = async(data: LoginFormValues) => {
    try {
        
        const response = await postRequest(API_ENDPOINTS.AUTH.LOGIN, {}, {}, data);

        // Check if response is successful and handle it
        if (response?.data?.accessToken) {
            alert(response?.data?.message); // Show success message

            // Save access token to localStorage

            localStorage.setItem('accessToken', response.data.accessToken);
            const payload={token:response.data.accessToken,name:response.data.user.name}
            localStorage.setItem('name',response?.data?.user?.name)
            // Dispatch the login action to update Redux state
            dispatch(login(payload));

            // Redirect to the home page or dashboard
            router.push("/home");
        } else {
            // Handle unsuccessful login response
            alert("Login failed, please try again.");
        }

    } catch (error: any) {
      // Handle any errors from the request (network, server errors, etc.)
      // console.error("Error during login:", error);
      alert(error?.response?.data?.message);
    }
  };

  return (
    <Card className="w-full h-fit md:w-[400px] flex justify-center items-center shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-[300px] flex-col justify-between gap-[15px]">
        <CardHeader className="flex items-center justify-center text-center p-7">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Please Enter your details to Log In</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-[30px]">
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
              placeholder="Enter your password"
              type={isPasswordVisible ? 'text' : 'password'}
              {...register("password")}
            />
            <div
              className="absolute top-6 translate-y-[-50%] right-[10px] cursor-pointer"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <FaEyeSlash className="h-[20px] w-auto" /> : <FaEye className="h-[20px] w-auto" />}
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="relative top-[40px] flex flex-col gap-[10px] items-center">
            <Button type="submit" className="primary w-full">Log In</Button>
          </div>
        </CardContent>
        <CardFooter className="pt-7">
          <div className="text-[14px] w-full text-center">
            Don't have an account? <Link href="/signup" className="text-blue-600">Click Here</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { SigninRequest } from "@/types/auth";

const formSchema = z.object({
  user_email: z.string().email("Invalid email address"),
  user_pwd: z.string().min(6, "Password must be at least 6 characters"),
});

const SigninPage = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_email: "",
      user_pwd: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const signinRequest: SigninRequest = {
        user_email: values.user_email,
        user_pwd: values.user_pwd,
      };

      const success = await signin(signinRequest);
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="font-poppins min-h-screen flex items-center justify-center bg-gray-50 p-6 sm:p-10">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          {/* Logo + Title */}
          <div className="text-center space-y-2">
            <img
              className="mx-auto w-[140px] h-auto object-contain"
              src="Nusummit.png"
              alt="Client Management System"
            />
            <h2 className="text-lg font-semibold text-gray-700">
              Client Management Portal
            </h2>
            <p className="text-sm text-gray-500">
              Sign in to continue
            </p>
          </div>

          {/* Signin Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="user_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_pwd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
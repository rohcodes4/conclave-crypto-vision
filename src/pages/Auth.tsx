
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, Mail, Lock, ArrowRight, KeyRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MatrixRain from "@/components/MatrixRain";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SplashScreenProps = {
  handleSplashComplete: () => void;
};

const Auth :  React.FC<SplashScreenProps> = ({ handleSplashComplete }) => {
  const { signInWithDiscord, signInWithEmail, signUpWithEmail, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
      navigate("/dashboard");
  }, []);
  // // Login form
  // const loginForm = useForm({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   }
  // });

  // // Signup form
  // const signupForm = useForm({
  //   resolver: zodResolver(signupSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //   }
  // });

  // // Reset password form
  // const resetForm = useForm({
  //   resolver: zodResolver(resetSchema),
  //   defaultValues: {
  //     email: "",
  //   }
  // });

  // // Redirect if already logged in
  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, [user, navigate]);

  // const handleSignInWithDiscord = async () => {
  //   handleSplashComplete;
  //   setIsLoading(true);
  //   try {
  //     await signInWithDiscord();
  //     // The actual redirection will be handled by Supabase's OAuth flow
  //   } catch (error) {
  //     console.error("Error signing in with Discord:", error);
  //     setIsLoading(false);
  //   }
  // };

  // const handleSignInWithEmail = async (values: z.infer<typeof loginSchema>) => {
  //   setIsLoading(true);
  //   try {
  //     await signInWithEmail(values.email, values.password);
  //     // Redirect will be handled by the auth context
  //   } catch (error) {
  //     console.error("Error signing in with email:", error);
  //     loginForm.setError("root", { 
  //       message: "Invalid email or password" 
  //     });
  //     setIsLoading(false);
  //   }
  // };

  // const handleSignUpWithEmail = async (values: z.infer<typeof signupSchema>) => {
  //   setIsLoading(true);
  //   try {
  //     await signUpWithEmail(values.email, values.password);
  //     // Show success notification or redirect
  //   } catch (error) {
  //     console.error("Error signing up with email:", error);
  //     signupForm.setError("root", { 
  //       message: "Email already in use or registration failed" 
  //     });
  //     setIsLoading(false);
  //   }
  // };
  
  // const handleResetPassword = async (values: z.infer<typeof resetSchema>) => {
  //   try {
  //     await resetPassword(values.email);
  //     setResetSent(true);
  //   } catch (error) {
  //     console.error("Error resetting password:", error);
  //     resetForm.setError("root", { 
  //       message: "Failed to send reset instructions" 
  //     });
  //   }
  // };

  return (
    <></>
    // <div className="flex justify-center items-center min-h-screen bg-crypto-bg px-4">
    //   <MatrixRain/>
    //   <Card className="border-crypto-card rounded-[25px] shadow-[#ff7229] border-[#ff7229] border-[4px] w-full max-w-md bg-crypto-card  font-pixel z-10">
    //     <CardHeader className="text-center">
    //       <CardTitle className="text-2xl text-[#ff7229]">Paper Trader</CardTitle>
    //       <CardDescription className="text-[10px] mt-2">Sign in to access your paper trading account</CardDescription>
    //     </CardHeader>
        
    //     <CardContent className="space-y-6">
    //       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    //         <TabsList className="grid grid-cols-2 w-full">
    //           <TabsTrigger value="login" className="data-[state=active]:bg-crypto-border data-[state=active]:text-white">Login</TabsTrigger>
    //           <TabsTrigger value="signup" className="data-[state=active]:bg-crypto-border data-[state=active]:text-white">Sign Up</TabsTrigger>
    //         </TabsList>
            
    //         <TabsContent value="login" className="mt-4 space-y-4">
    //           <Form {...loginForm}>
    //             <form onSubmit={loginForm.handleSubmit(handleSignInWithEmail)} className="space-y-4">
    //               <FormField
    //                 control={loginForm.control}
    //                 name="email"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Email</FormLabel>
    //                     <FormControl>
    //                       <div className="relative text-black">
    //                         <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#666666]" />
    //                         <Input placeholder="your@email.com" className="pl-10 text-[#333333]" {...field} />
    //                       </div>
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
                  
    //               <FormField
    //                 control={loginForm.control}
    //                 name="password"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Password</FormLabel>
    //                     <FormControl>
    //                       <div className="relative">
    //                         <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#666666]" />
    //                         <Input type="password" placeholder="••••••••" className="pl-10 text-[#333333]" {...field} />
    //                       </div>
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
                  
    //               {loginForm.formState.errors.root && (
    //                 <p className="text-sm font-medium text-destructive">{loginForm.formState.errors.root.message}</p>
    //               )}
                  
    //               <div className="flex justify-end">
    //                 <Dialog>
    //                   <DialogTrigger asChild>
    //                     <Button type="button" variant="link" className="p-0 h-auto font-normal text-[10px]">
    //                       Forgot password?
    //                     </Button>
    //                   </DialogTrigger>
    //                   <DialogContent className="sm:max-w-md bg-black">
    //                     <DialogHeader>
    //                       <DialogTitle>Reset Password</DialogTitle>
    //                       <DialogDescription>
    //                         Enter your email and we'll send you a link to reset your password.
    //                       </DialogDescription>
    //                     </DialogHeader>
                        
    //                     <Form {...resetForm}>
    //                       <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4 py-4">
    //                         {!resetSent ? (
    //                           <>
    //                             <FormField
    //                               control={resetForm.control}
    //                               name="email"
    //                               render={({ field }) => (
    //                                 <FormItem>
    //                                   <FormLabel>Email</FormLabel>
    //                                   <FormControl>
    //                                     <Input placeholder="your@email.com" className="text-[#666666]" {...field} />
    //                                   </FormControl>
    //                                   <FormMessage />
    //                                 </FormItem>
    //                               )}
    //                             />
                                
    //                             {resetForm.formState.errors.root && (
    //                               <p className="text-sm font-medium text-destructive">{resetForm.formState.errors.root.message}</p>
    //                             )}
                                
    //                             <DialogFooter className="sm:justify-start">
    //                               <Button type="submit" className="w-full">
    //                                 <KeyRound className="mr-2 h-4 w-4" />
    //                                 Send Reset Instructions
    //                               </Button>
    //                             </DialogFooter>
    //                           </>
    //                         ) : (
    //                           <div className="text-center py-4">
    //                             <p className="text-green-500">Password reset link sent!</p>
    //                             <p className="text-sm text-muted-foreground mt-2">
    //                               Please check your email for the reset link.
    //                             </p>
    //                           </div>
    //                         )}
    //                       </form>
    //                     </Form>
    //                   </DialogContent>
    //                 </Dialog>
    //               </div>
                  
    //               <Button 
    //                 type="submit" 
    //                 className="w-full bg-crypto-accent hover:bg-crypto-accent/90 max-md:text-[12px]"
    //                 disabled={isLoading}
    //               >
    //                 {isLoading ? "Signing in..." : "Sign in with Email"}
    //                 <ArrowRight className="ml-2 h-4 w-4" />
    //               </Button>
    //             </form>
    //           </Form>
              
    //           <div className="relative">
    //             <div className="absolute inset-0 flex items-center">
    //               <span className="w-full border-t border-crypto-card"></span>
    //             </div>
    //             <div className="relative flex justify-center text-[10px]">
    //               <span className="bg-crypto-card px-2 text-crypto-muted ">Or continue with</span>
    //             </div>
    //           </div>
              
    //           <Button 
    //             onClick={handleSignInWithDiscord}
    //             className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 max-md:text-[11px]"
    //             disabled={isLoading}
    //           >
    //             <ExternalLink className="h-5 w-5 " />
    //             {isLoading ? "Connecting..." : "Sign in with Discord"}
    //           </Button>
    //         </TabsContent>
            
    //         <TabsContent value="signup" className="mt-4 space-y-4">
    //           <Form {...signupForm}>
    //             <form onSubmit={signupForm.handleSubmit(handleSignUpWithEmail)} className="space-y-4">
    //               <FormField
    //                 control={signupForm.control}
    //                 name="email"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Email</FormLabel>
    //                     <FormControl>
    //                       <div className="relative">
    //                         <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#666666]" />
    //                         <Input placeholder="your@email.com" className="pl-10 text-[#333333]" {...field} />
    //                       </div>
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
                  
    //               <FormField
    //                 control={signupForm.control}
    //                 name="password"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Password</FormLabel>
    //                     <FormControl>
    //                       <div className="relative">
    //                         <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground text-[#666666]" />
    //                         <Input type="password" placeholder="••••••••" className="pl-10 text-[#333333]" {...field} />
    //                       </div>
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
                  
    //               <FormField
    //                 control={signupForm.control}
    //                 name="confirmPassword"
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Confirm Password</FormLabel>
    //                     <FormControl>
    //                       <div className="relative">
    //                         <Lock className="absolute left-3 top-2.5 h-5 w-5 text-[#666666]" />
    //                         <Input type="password" placeholder="••••••••" className="pl-10 text-[#333333]" {...field} />
    //                       </div>
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
                  
    //               {signupForm.formState.errors.root && (
    //                 <p className="text-sm font-medium text-destructive">{signupForm.formState.errors.root.message}</p>
    //               )}
                  
    //               <Button 
    //                 type="submit" 
    //                 className="w-full bg-crypto-accent hover:bg-crypto-accent/90"
    //                 disabled={isLoading}
    //               >
    //                 {isLoading ? "Creating Account..." : "Create Account"}
    //                 <ArrowRight className="ml-2 h-4 w-4" />
    //               </Button>
    //             </form>
    //           </Form>
              
    //           <div className="relative">
    //             <div className="absolute inset-0 flex items-center">
    //               <span className="w-full border-t border-crypto-card"></span>
    //             </div>
    //             <div className="relative flex justify-center text-[10px]">
    //               <span className="bg-crypto-card px-2 text-crypto-muted">Or continue with</span>
    //             </div>
    //           </div>
              
    //           <Button 
    //             onClick={handleSignInWithDiscord}
    //             className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 max-md:text-[11px]"
    //             disabled={isLoading}
    //           >
    //             <ExternalLink className="h-5 w-5" />
    //             {isLoading ? "Connecting..." : "Sign up with Discord"}
    //           </Button>
    //         </TabsContent>
    //       </Tabs>
    //     </CardContent>
        
    //     <CardFooter className="flex flex-col text-center">
    //       <p className="text-[9px] text-crypto-muted">
    //         By signing in, you agree to our Terms of Service and Privacy Policy.
    //       </p>
    //     </CardFooter>
    //   </Card>
    // </div>
  );
};

export default Auth;

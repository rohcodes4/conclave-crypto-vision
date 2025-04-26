
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, CreditCard, Shield, UserCog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatUserIdentifier } from "@/components/auth/AccountMenu";
import { getDisplayName, getProvider } from "@/lib/utils";

const Settings = () => {
  const { user, getSignedInProvider, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') || 'profile';
  const [provider, setProvider] = useState("");
  const [isTelegram, setIsTelegram] = useState(false);
  
  useEffect(()=>{
    if(user?.email.includes("telegram")){
      setIsTelegram(true)
    }
  },[user])

  useEffect(() => {
    const fetchProvider = async () => {
      const provider = await getSignedInProvider();
      if (provider) {
        setProvider(provider); // ✅ now passing a string, not a Promise
      }
    };
  
    fetchProvider();
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subscription, setSubscription] = useState({
    plan: 'free',
    status: 'active'
  });

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Load subscription data
        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan, status')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          setSubscription({
            plan: data.plan,
            status: data.status
          });
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);

  // const handleDeleteAccount = async () => {
  //   if (!user) return;
  
  //   try {
  //     setIsDeleting(true);
  
  //     // Get session to retrieve the access token
      // const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      // if (sessionError || !session?.access_token) throw new Error("Unable to retrieve session.");
  
  //     const res = await fetch('https://pulzjmzhbqunbjfqehmd.supabase.co/auth/v1/user', {
  //       method: 'DELETE',
  //       headers: {
  //         Authorization: `Bearer ${session.access_token}`,
  //         apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bHpqbXpoYnF1bmJqZnFlaG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDEwMTQsImV4cCI6MjA1OTg3NzAxNH0.ApeTujrwkwjQx71sfX5bcs7j_7xOZqmVSF1-k0gRqOc', // This is safe to use on client
  //       },
  //     });
  
  //     if (!res.ok) {
  //       const err = await res.json();
  //       throw new Error(err.message || "Failed to delete account.");
  //     }
  
  //     toast.success("Account deleted successfully");
  //     await supabase.auth.signOut();
  //     navigate("/auth");
  
  //   } catch (error: any) {
  //     console.error("Error deleting account:", error);
  //     toast.error("Failed to delete account: " + error.message);
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };

  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) throw error;
      
      toast.success("Account deleted successfully");
      navigate("/auth");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account: " + error.message);
      await signOut();
    } finally {
      setIsDeleting(false);
    }
  };

  const initiateSubscription = async (plan: string) => {
    // This would normally connect to a payment gateway
    toast("Connecting to payment gateway...", {
      description: `Setting up ${plan} subscription`
    });
    
    // For demo purposes, we'll just update the subscription in the database
    setTimeout(() => {
      toast.success(`Successfully upgraded to ${plan} plan!`);
      setSubscription({
        plan,
        status: 'active'
      });
    }, 2000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-crypto-muted">Please sign in to access settings</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-12 w-12 border-2 border-crypto-accent">
          <AvatarFallback className="bg-crypto-accent text-white text-lg">
            {user.email?.[0].toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-crypto-muted">{getDisplayName()}</p>
        </div>
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="profile" className="flex-1">
            <UserCog className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          {/* <TabsTrigger value="subscription" className="flex-1">
            <CreditCard className="w-4 h-4 mr-2" />
            Subscription
          </TabsTrigger> */}
          <TabsTrigger value="security" className="flex-1">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-crypto-card bg-crypto-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {user.email.includes("telegram") && <Label htmlFor="email">Telegram</Label>}
                {user.email.includes("wallet") && <Label htmlFor="email">Wallet:</Label>}
                {(!user.email.includes("telegram") && !user.email.includes("wallet")) && <Label htmlFor="email">Email</Label>}
                <Input
                  id="email"
                  value={getDisplayName() || ""}
                  disabled
                  className="bg-crypto-bg border-crypto-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-provider">Authentication Provider</Label>
                <Input
                  id="auth-provider"
                  value={isTelegram?"Telegram":capitalize(provider)}
                  disabled
                  className="bg-crypto-bg border-crypto-card"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="subscription">
          <Card className="border-crypto-card bg-crypto-card">
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <>
                  <div className="p-4 bg-crypto-bg rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">Current Plan</h3>
                        <p className="text-crypto-muted text-sm capitalize">{subscription.plan}</p>
                      </div>
                      <Badge variant="outline" className="bg-crypto-card capitalize">{subscription.status}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`p-4 rounded-md ${subscription.plan === 'free' ? 'border-2 border-crypto-accent' : 'border border-crypto-card'}`}>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold">Free</h3>
                        <p className="text-2xl font-bold mt-2">$0 <span className="text-sm font-normal text-crypto-muted">/month</span></p>
                      </div>
                      
                      <ul className="space-y-2 text-sm mb-6">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Basic token tracking
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Limited market data
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Standard data refresh
                        </li>
                      </ul>
                      
                      {subscription.plan === 'free' ? (
                        <Button className="w-full" disabled>Current Plan</Button>
                      ) : (
                        <Button variant="outline" className="w-full" onClick={() => initiateSubscription('free')}>Downgrade</Button>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-md ${subscription.plan === 'pro' ? 'border-2 border-crypto-accent' : 'border border-crypto-card'} bg-crypto-bg`}>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold">Pro</h3>
                        <div className="flex items-baseline mt-2">
                          <p className="text-2xl font-bold">$9.99</p>
                          <span className="text-sm font-normal text-crypto-muted ml-1">/month</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 text-sm mb-6">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          All Free features
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Faster data refresh
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Advanced analytics
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Alert system
                        </li>
                      </ul>
                      
                      {subscription.plan === 'pro' ? (
                        <Button className="w-full" disabled>Current Plan</Button>
                      ) : (
                        <Button className="w-full bg-crypto-accent hover:bg-crypto-highlight" onClick={() => initiateSubscription('pro')}>
                          {subscription.plan === 'premium' ? 'Downgrade' : 'Upgrade'}
                        </Button>
                      )}
                    </div>
                    
                    <div className={`p-4 rounded-md ${subscription.plan === 'premium' ? 'border-2 border-crypto-accent' : 'border border-crypto-card'}`}>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold">Premium</h3>
                        <div className="flex items-baseline mt-2">
                          <p className="text-2xl font-bold">$19.99</p>
                          <span className="text-sm font-normal text-crypto-muted ml-1">/month</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 text-sm mb-6">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          All Pro features
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Real-time data
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          AI trading signals
                        </li>
                        <li className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Priority support
                        </li>
                      </ul>
                      
                      {subscription.plan === 'premium' ? (
                        <Button className="w-full" disabled>Current Plan</Button>
                      ) : (
                        <Button className="w-full bg-crypto-accent hover:bg-crypto-highlight" onClick={() => initiateSubscription('premium')}>Upgrade</Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="security">
          <Card className="border-crypto-card bg-crypto-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Connected Accounts</Label>
                <div className="p-3 bg-crypto-bg rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-[#5865F2] rounded-md flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{capitalize(getProvider().slice(0,1))}</span>
                    </div>
                    <div>
                      <p className="font-medium">{getProvider()}</p>
                      <p className="text-xs text-crypto-muted">{getDisplayName()}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-crypto-card">
                    Connected
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full bg-red-900 hover:bg-red-800 text-white">
                      Sign Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-crypto-card border-crypto-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-crypto-bg">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-900 hover:bg-red-800 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteAccount();
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Signing out..." : "Sign Out"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

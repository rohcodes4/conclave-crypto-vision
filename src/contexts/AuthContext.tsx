
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithDiscord: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  getSignedInProvider: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          const provider = session?.user?.app_metadata?.provider || 'email';
          const email = session?.user?.email;
          if(email.includes("telegram")){
          toast.success(`Signed in successfully with Telegram`);
          } else if(email.includes("wallet")){
            toast.success(`Signed in successfully with Wallet`);          
          } else{
            toast.success(`Signed in successfully with ${provider}`);

          }
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out');
        } else if (event === 'PASSWORD_RECOVERY') {
          // Handle password recovery flow
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          
          if (accessToken) {
            toast.info('You can now reset your password');
            // You could redirect to a password reset form here
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithDiscord = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      if (error.message.includes('User already registered')) {
        toast.error('Account already exists. Try signing in with email.');
      } else {
        toast.error(error.message || 'Failed to sign in with Discord');
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email before logging in');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message || 'Failed to sign in with email');
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });
      
      if (error) throw error;

      // Check if user exists but signed up with a different provider
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error(`Email ${email} is already registered with ${data.user?.identities?.[0]?.provider}. Try another login method.`);
        throw new Error('Email already registered with a different provider');
      }
      toast.success(`Logged in succesfully with ${data.user?.identities?.[0]?.provider}`)
      // toast.success('Verification email sent. Please check your inbox.');
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        toast.error(`Email ${email} is already registered. Try signing in instead.`);
      } else {
        toast.error(error.message || 'Failed to sign up with email');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const getSignedInProvider = async () => {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();
  
    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }
  
    // Accessing the provider from identities
    const provider = user?.identities?.[0]?.provider;
    console.log("Signed-in provider:", provider); // e.g., 'google', 'github', 'email', etc.
  
    return provider;
  }
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signInWithDiscord, 
      signInWithEmail, 
      signUpWithEmail, 
      resetPassword, 
      signOut,
      getSignedInProvider 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

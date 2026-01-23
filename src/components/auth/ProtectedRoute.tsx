import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink } from 'lucide-react';
import diamond from '@/assets/images/diamond.png';
import TelegramLogin from '../TelegramLogin';
import Web3Login from '../Web3Login';
import { AuthForm } from '@/components/ui/sign-in-1';

type SplashScreenProps = {
  handleSplashComplete: () => void;
};

// Icon components for AuthForm
const IconDiscord = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
      fill="currentColor"
    />
  </svg>
);
const IconTelegram = (props: React.SVGProps<SVGSVGElement>) => (  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path 
    d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z"
    fill="currentColor"/>
  </svg>
);

// const IconTelegram = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     {...props}
//   >
//     <path
//       d="M16.906 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"
//       fill="currentColor"
//     />
//   </svg>
// );


const IconWeb3Wallet = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    {...props}
  >
    <path
      d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5 .67 1.5 1.5-.67 1.5-1.5 1.5z"
      fill="currentColor"
    />
  </svg>
);


const ProtectedRoute: React.FC<SplashScreenProps> = ({ handleSplashComplete }) => {
  const { user, loading, signInWithDiscord } = useAuth();

  const handleDiscordSignIn = async () => {
    try {
      handleSplashComplete();
      await signInWithDiscord();
    } catch (error) {
      console.error('Discord sign in error:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,black)]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border border-white/20 rounded-full animate-spin border-t-white mb-6" />
          <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  // Login state - Using AuthForm component
  if (!user) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden p-4">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,black)]" />
        
        {/* Noise overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[url('/noise.png')]" />

        {/* AuthForm with custom styling */}
        <div className="relative z-10 w-full max-w-md">
          <AuthForm
            logoSrc={diamond}
            logoAlt="Paper Trader Diamond"
            title="PAPER TRADER"
            description="Sign in to access the application"
            primaryAction={{
              label: "Continue with Discord",
              icon: <IconDiscord className="mr-2 h-4 w-4" />,
              onClick: handleDiscordSignIn,
            }}
            secondaryActions={[
              {
                label: "Continue with Telegram",
                icon: <IconTelegram className="mr-2 h-4 w-4" />,
                onClick: () => {
                  // TelegramLogin component integration
                  // You'll need to extract the onClick logic from TelegramLogin
                  console.log('Telegram login');
                },
              },
              {
                label: "Continue with Wallet",
                icon: <IconWeb3Wallet className="mr-2 h-4 w-4" />,
                onClick: () => {
                  // Web3Login component integration
                  // You'll need to extract the onClick logic from Web3Login
                  console.log('Web3 login');
                },
              },
            ]}
            footerContent={
              <>
                By logging in, you agree to our Terms of Service and Privacy Policy.
              </>
            }
          />
        </div>

        {/* Custom styles for pixel font and animations */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}
        </style>
      </div>
    );
  }

  // Authenticated state
  return <Outlet />;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail } from 'lucide-react';
import logo from '@/assets/images/logo.png';
import diamond from '@/assets/images/diamond.png';
// import video from '@/assets/videos/loader.mp4';
import frame from '@/assets/images/frame.png';
// import MetallicBackground from '@/components/MetallicBackground';
import bg from '@/assets/videos/bg.mp4';
import MatrixRain from '../MatrixRain';

const ProtectedRoute: React.FC = () => {
  const { user, loading, signInWithDiscord } = useAuth();

  const handleDiscordSignIn = async () => {
    try {
      await signInWithDiscord();
    } catch (error) {
      console.error('Discord sign in error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-crypto-bg">
        <div className="w-16 h-16 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin mb-8"></div>
        <p className="text-crypto-muted">Loading...</p>
      </div>
    );
  }

  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-crypto-bg p-4 z-4 relative">
        {/* Video background behind everything */}
        {/* <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={bg} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <MatrixRain/>
        {/* Foreground content starts */}
        <div className="relative w-full max-w-md z-10 -mt-28 overflow-visible  rounded-xl">
          {/* Frame image in front of video */}
          {/* <img
            src={frame}
            alt="frame"
            className="max-md:hidden absolute inset-0 w-[120%] h-[150%] -top-[17%] object-cover pointer-events-none overflow-visible z-10"
          /> */}

          {/* Login card */}
          <div className="relative z-20 rounded-lg p-6 md:p-8 w-full font-pixel text-white overflow-visible">
            <img src={diamond} className="max-h-[200px] mx-auto" />

            <h1 className="mt-3 text-2xl md:text-3xl font-bold text-crypto-border mb-8 text-center uppercase tracking-[5px] text-shadow-(color:#ffffff) text-shadow-lg" style={{ WebkitTextStroke: "1px white" }}>
              Paper Trader
            </h1>

            <p className="mb-8 text-white text-center text-xs max-md:w-[200px] mx-auto">
              You need to sign in to access this application.
            </p>

            <div className="space-y-4">
              <Link to="/auth">
                <Button className="w-max mx-auto flex rounded-full bg-crypto-success hover:bg-crypto-success/90 max-md:text-[11px]">
                  <Mail className="mr-2 h-5 w-5" />
                  Sign in with Email
                </Button>
              </Link>

              <div className="relative flex justify-center text-xs">
                <span className="rounded-lg px-2 text-white">Or</span>
              </div>

              <Button
                onClick={handleDiscordSignIn}
                className="w-max mx-auto rounded-full shadow-lg  bg-[#5865F2] hover:bg-[#4752C4] flex items-center justify-center gap-2 max-md:text-[11px]"
              >
                <ExternalLink className="h-5 w-5" />
                Sign in with Discord
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;


// import React from 'react';
// import { Navigate, Outlet, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { ExternalLink, Mail } from 'lucide-react';
// import logo from '@/assets/images/logo.png';
// import diamond from '@/assets/images/diamond.png';
// import video from '@/assets/videos/loader.mp4';
// import frame from '@/assets/images/frame.png';
// import MetallicBackground from '@/components/MetallicBackground';

// const ProtectedRoute: React.FC = () => {
//   const { user, loading, signInWithDiscord } = useAuth();

//   const handleDiscordSignIn = async () => {
//     try {
//       await signInWithDiscord();
//     } catch (error) {
//       console.error('Discord sign in error:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-crypto-bg">
//         <div className="w-16 h-16 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin mb-8"></div>
//         <p className="text-crypto-muted">Loading...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-crypto-bg p-4 z-4 relative">
//         {/* <div className="moving-background"></div> */}

//         {/* Container to position frame image absolutely */}
//         <div className="relative w-full max-w-md z-[1] -mt-28 overflow-visible ">
//           {/* Frame Image Positioned Absolutely */}
//           <img
//             src={frame}
//             alt="frame"
//             className="max-md:hidden absolute inset-0 w-[120%] h-[150%] -top-[15%] object-cover pointer-events-none overflow-visible"
//           />

//           {/* Login Card Content */}
//           <div className="relative z-10 rounded-lg p-6 md:p-8 w-full font-pixel text-white overflow-visible">
//             <img src={diamond} className="max-h-[200px] mx-auto" />

//             <h1 className="mt-3 text-2xl md:text-3xl font-bold text-crypto-border mb-8 text-center uppercase tracking-[5px]">
//               Paper Trader
//             </h1>

//             <p className="mb-8 text-white text-center text-xs max-md:w-[200px] mx-auto">
//               You need to sign in to access this application.
//             </p>

//             <div className="space-y-4">
//               <Link to="/auth">
//                 <Button className="w-max mx-auto flex rounded-full bg-crypto-success hover:bg-crypto-success/90 max-md:text-[11px]">
//                   <Mail className="mr-2 h-5 w-5" />
//                   Sign in with Email
//                 </Button>
//               </Link>

//               <div className="relative flex justify-center text-xs">
//                 <span className="rounded-lg px-2 text-white">Or</span>
//               </div>

//               <Button
//                 onClick={handleDiscordSignIn}
//                 className="w-max mx-auto rounded-full shadow-lg  bg-[#5865F2] hover:bg-[#4752C4] flex items-center justify-center gap-2 max-md:text-[11px]"
//               >
//                 <ExternalLink className="h-5 w-5" />
//                 Sign in with Discord
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

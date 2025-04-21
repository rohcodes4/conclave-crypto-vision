// components/Web3Login.tsx
import { useState } from 'react';
import { ethers } from 'ethers';

const Web3Login = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const loginWithWeb3 = async () => {
    try {
      setLoading(true);

      // Connect MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Sign message
      const message = `Login to MyApp\n${Date.now()}`;
      const signature = await signer.signMessage(message);

      // Send to Supabase Edge Function
      const res = await fetch('https://pulzjmzhbqunbjfqehmd.supabase.co/functions/v1/web3-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress, message, signature }),
      });

      const { token } = await res.json();

      if (!token) throw new Error("No token received");

      // Store token locally
      localStorage.setItem("supabase_web3_token", token);

      // Decode JWT to get address
      const payload = JSON.parse(atob(token.split('.')[1]));
      setAddress(payload.sub);
      console.log("Logged in as:", payload.sub);

    } catch (err) {
      console.error("Web3 login error:", err);
      alert("Web3 login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center'>
      <button onClick={loginWithWeb3} disabled={loading}>
        {loading ? 'Logging in...' : 'Login with MetaMask'}
      </button>
      {address && <p>Logged in as: {address}</p>}
    </div>
  );
};

export default Web3Login;

// import { useState } from 'react';
// // import { supabase } from '@/integrations/supabase/client';
// import { ethers } from 'ethers';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   'https://pulzjmzhbqunbjfqehmd.supabase.co',
//   '7Qc/C1i4p+BucDr2039BVsg49EiX787DAUu9St3LyYRbqzdSvouoMDQ+/Cgap/zxThIB5Cqs9UUEmgftgaALWA==' 
// );

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// const Web3Login = () => {
//   const [address, setAddress] = useState('');
//   const [loading, setLoading] = useState(false);

//   const loginWithWeb3 = async () => {
//     try {
//       setLoading(true);
  
//       if (!window.ethereum) {
//         console.error('MetaMask not available');
//         return;
//       }
  
//       console.log('Requesting wallet connection...');
//     //   const provider = new ethers.BrowserProvider(window.ethereum);
//     //   await provider.send("eth_requestAccounts", []);
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
// await provider.send("eth_requestAccounts", []);
// // const signer = provider.getSigner();

  
//       const signer = await provider.getSigner();
//       const walletAddress = await signer.getAddress();
//       console.log('Connected wallet address:', walletAddress);
  
//       const message = `Login to MyApp\n${Date.now()}`;
//       console.log('Message to sign:', message);
  
//       const signature = await signer.signMessage(message);
//       console.log('Signature:', signature);

      
//       const res = await fetch('https://pulzjmzhbqunbjfqehmd.supabase.co/functions/v1/web3-login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ address, message, signature }),
//       });
      
  
//       console.log('Fetch complete, parsing token...');
//     //   const { token } = await res.json();
//       const { token } = await res.json();

// if (token) {
//   // Optional: Save token to localStorage/sessionStorage
//   localStorage.setItem('supabase_web3_token', token);

//   // Decode the JWT to get the wallet address
//   const payload = JSON.parse(atob(token.split('.')[1]));
//   console.log('Wallet address:', payload.sub);

//   // Optionally: set it to your app state / context
//   setAddress(payload.sub);
// }
  
//       const { data, error } = await supabase.auth.signInWithIdToken({
//         provider: 'jwt',
//         token,
//       });
      
//       if (error) throw error;
//       setAddress(walletAddress);
//     } catch (err) {
//       console.error('Login failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className='flex justify-center'>
//       <button onClick={loginWithWeb3} disabled={loading} className='text-center mx-auto'>
//         {loading ? 'Logging in...' : 'Login with wallet'}
//       </button>
//       {address && <p>Logged in as: {address}</p>}
//     </div>
//   );
// };

// export default Web3Login;

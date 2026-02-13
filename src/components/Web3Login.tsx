import {
  useWallet,
  useConnection
} from '@solana/wallet-adapter-react';
import { WalletModalContext } from '@solana/wallet-adapter-react-ui';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Wallet } from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Button } from './ui/button';

const Web3Login = () => {
  const { publicKey, signMessage, connected, connect, disconnect } = useWallet();
  const { setVisible } = useContext(WalletModalContext);
  const [shouldSign, setShouldSign] = useState(false);

  console.log('publicKey', publicKey.toBase58())
  const startLogin = () => {
    if (!connected) {
      setVisible(true); // open wallet selector
      setShouldSign(true); // flag to sign after connection
    } else {
      handleLogin(); // directly sign if already connected
    }
  };

  const handleLogin = useCallback(async () => {
    try {
      if (!publicKey || !signMessage) throw new WalletNotConnectedError();

      const message = `Login request for ${publicKey.toBase58()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      const res = await fetch('https://nqibrtuxmslqdjnrpjvd.supabase.co/functions/v1/wallet-login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`  // Optional
        },
        body: JSON.stringify({
          address: publicKey.toBase58(),
          signature: Buffer.from(signature).toString('base64'),
          message,
        }),
      });      

      const data = await res.json();
      if (data.success) {
        window.location.href = data.login_url;
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong.');
    }
  }, [publicKey, signMessage]);

  // Automatically sign after connection
  useEffect(() => {
    if (connected && shouldSign) {
      handleLogin();
      setShouldSign(false); // reset
    }
  }, [connected, shouldSign, handleLogin]);

  return (
      <Button onClick={startLogin} className="bg-[#2a2a2a] hover:bg-white hover:text-black w-full transition-transform hover:scale-[1.03]">
      <Wallet className="h-4 w-4" />
        Login with Wallet
      </Button>
  );
};

export default Web3Login;

// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletModalContext } from '@solana/wallet-adapter-react-ui';
// import { useConnectModal } from '@rainbow-me/rainbowkit';
// import React, { useContext, useCallback, useEffect, useState } from 'react';
// import { Wallet } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';

// declare global {
//   interface Window {
//     solana?: any;
//   }
// }

// const Web3Login = () => {
//   const { publicKey, connected: solConnected, signMessage } = useWallet();
//   const { setVisible: setSolVisible } = useContext(WalletModalContext);
//   const { openConnectModal: openEvmConnect } = useConnectModal();
//   const [shouldSign, setShouldSign] = useState<'solana' | 'evm' | null>(null);

//   const handleSolanaLogin = useCallback(async () => {
//     if (!publicKey || !signMessage || !window.solana) return;

//     const { data, error } = await supabase.auth.signInWithWeb3({
//       chain: 'solana',
//       statement: 'I accept the Terms of Service for paper trading app.',
//       wallet: window.solana,
//     });

//     if (error) {
//       console.error('Login error:', error);
//       alert('Login failed: ' + error.message);
//     }
//   }, [publicKey, signMessage]);

//   const handleEvmLogin = useCallback(async () => {
//     const { data, error } = await supabase.auth.signInWithWeb3({
//       chain: 'ethereum',
//       statement: 'I accept the Terms of Service for paper trading app.',
//     });

//     if (error) {
//       console.error('Login error:', error);
//       alert('Login failed: ' + error.message);
//     }
//   }, []);

//   const startSolanaLogin = () => {
//     if (!solConnected) {
//       setSolVisible(true);
//       setShouldSign('solana');
//     } else {
//       handleSolanaLogin();
//     }
//   };

//   const startEvmLogin = () => {
//     openEvmConnect?.();
//     setShouldSign('evm');
//   };

//   useEffect(() => {
//     if (shouldSign === 'solana' && solConnected) {
//       handleSolanaLogin();
//       setShouldSign(null);
//     }
//   }, [solConnected, shouldSign, handleSolanaLogin]);

//   useEffect(() => {
//     if (shouldSign === 'evm') {
//       handleEvmLogin();
//       setShouldSign(null);
//     }
//   }, [shouldSign, handleEvmLogin]);

//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <button
//         onClick={startSolanaLogin}
//         className="bg-[#ff7229] text-white text-sm px-4 py-2 rounded-full flex justify-center gap-3 items-center max-md:text-[11px] cursor-pointer"
//         disabled={!window.solana}
//       >
//         <Wallet className="h-4 w-4" />
//         {solConnected ? 'Solana Login' : 'Connect Solana'}
//       </button>
      
//       <button
//         onClick={startEvmLogin}
//         className="bg-[#ff7229] text-white text-sm px-4 py-2 rounded-full flex justify-center gap-3 items-center max-md:text-[11px] cursor-pointer"
//       >
//         <Wallet className="h-4 w-4" />
//         Connect EVM
//       </button>
//     </div>
//   );
// };

// export default Web3Login;




// // Web3Login.tsx
// import { useState, useCallback } from 'react';
// import { Wallet } from 'lucide-react';
// import { useWallet, useConnection } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import axios from 'axios';
// import { PublicKey } from '@solana/web3.js';
// import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

// export default function Web3Login() {
//   const { publicKey, signMessage, connected, connect, disconnect } = useWallet();
//   const { connection } = useConnection();

//   const login = useCallback(async () => {
//     try {
//       if (!connected) {
//         await connect();
//       }

//       if (!publicKey) throw new WalletNotConnectedError();
//       if (!signMessage) throw new Error('Wallet does not support message signing');

//       const message = `Login request for ${publicKey.toBase58()}`;
//       const encodedMessage = new TextEncoder().encode(message);
//       const signature = await signMessage(encodedMessage);

//       // Send to your backend
//       const res = await fetch('/auth/web3', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           address: publicKey.toBase58(),
//           signature: Buffer.from(signature).toString('base64'),
//           message,
//         }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         window.location.href = data.login_url;
//       } else {
//         alert('Login failed');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       alert('Something went wrong.');
//     }
//   }, [publicKey, signMessage, connected, connect]);

//   return (
//     <button
//       onClick={login}
//       className="bg-[#ff7229] text-white text-sm px-4 py-2 rounded-full w-full flex justify-center gap-3 items-center max-md:text-[11px]"
//     >
//       <Wallet className="h-4 w-4" />
//       Sign to Login
//     </button>
//   );

// }


// // import { useState } from 'react';
// // import { ethers } from 'ethers';
// // import axios from 'axios';
// // import { Wallet } from 'lucide-react';

// // export default function Web3Login() {
// //   const [status, setStatus] = useState('');

// //   const loginWithWallet = async () => {
// //     try {
// //       if (!window.ethereum) return alert('Open in a Web3 Browser');

// //       const provider = new ethers.providers.Web3Provider(window.ethereum);
// //       await provider.send("eth_requestAccounts", []);
// //       const signer = provider.getSigner();
// //       const address = await signer.getAddress();
      

// //       const message = `Login to PaperTrader with this wallet: ${address}`;
// //       console.log("Signing message:", message);
// //       const signature = await window.ethereum.request({
// //         method: "personal_sign",
// //         params: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), address]
// //       });

// //       setStatus('🔗 Verifying...');

// //       const { data } = await axios.post(`${import.meta.env.VITE_RENDER_URL}/auth/web3`, {
// //         address,
// //         message,
// //         signature
// //       });

// //       if (data?.login_url) {
// //         setStatus('✅ Logging in...');
// //         window.location.href = data.login_url;
// //       } else {
// //         setStatus('❌ Login failed');
// //       }

// //     } catch (err) {
// //       console.error(err);
// //       setStatus('❌ Error occurred');
// //     }
// //   };

// //   return (
// //     <div className='flex flex-col items-center justify-center'>
// //       <button onClick={loginWithWallet} className="bg-[#ff7229] text-white text-sm px-4 py-2 rounded-full w-full flex justify-center gap-3 items-center max-md:text-[11px]">
// //         <Wallet className="h-4 w-4" />      
// //         Connect Wallet
// //       </button>
// //       <p>{status}</p>
// //     </div>
// //   );
// // }

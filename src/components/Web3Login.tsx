import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ethers } from 'ethers';


declare global {
  interface Window {
    ethereum?: any;
  }
}

const Web3Login = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const loginWithWeb3 = async () => {
    try {
      setLoading(true);
  
      if (!window.ethereum) {
        console.error('MetaMask not available');
        return;
      }
  
      console.log('Requesting wallet connection...');
    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   await provider.send("eth_requestAccounts", []);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
// const signer = provider.getSigner();

  
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      console.log('Connected wallet address:', walletAddress);
  
      const message = `Login to MyApp\n${Date.now()}`;
      console.log('Message to sign:', message);
  
      const signature = await signer.signMessage(message);
      console.log('Signature:', signature);

      
      const res = await fetch('https://pulzjmzhbqunbjfqehmd.supabase.co/functions/v1/web3-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress, message, signature }),
      });
  
      console.log('Fetch complete, parsing token...');
      const { token } = await res.json();
  
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'web3',
        token,
      });
  
      if (error) throw error;
      setAddress(walletAddress);
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={loginWithWeb3} disabled={loading} className='text-center mx-auto'>
        {loading ? 'Logging in...' : 'Login with wallet'}
      </button>
      {address && <p>Logged in as: {address}</p>}
    </div>
  );
};

export default Web3Login;

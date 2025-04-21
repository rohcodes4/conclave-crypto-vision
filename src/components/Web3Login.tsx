import { useState } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';


declare global {
    interface Window {
      ethereum?: any
    }
  }

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

      // Send to lightweight serverless function (for verifying and creating JWT)
      const res = await fetch('https://pulzjmzhbqunbjfqehmd.supabase.co/functions/v1/web3-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
    });

      const { token } = await res.json();

      // Use Supabase JWT sign-in
      const { data, error } = await supabase.auth.signInWithIdToken({
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
      <button onClick={loginWithWeb3} disabled={loading}>
        {loading ? 'Logging in...' : 'Login with MetaMask'}
      </button>
      {address && <p>Logged in as: {address}</p>}
    </div>
  );
};

export default Web3Login;


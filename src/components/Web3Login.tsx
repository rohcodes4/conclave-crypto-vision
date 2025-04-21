import { useState } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';

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

      // Ensure MetaMask is available
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask not found');
        alert('MetaMask is not installed');
        setLoading(false);
        return;
      }

      // Connect to MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      console.log('Connected wallet address:', walletAddress);

      // Sign message
      const message = `Login to MyApp\n${Date.now()}`;
      const signature = await signer.signMessage(message);
      
      console.log('Message to sign:', message);
      console.log('Signature:', signature);

      console.log('Sending to API with:', { address: walletAddress, message, signature });

      // Send to Supabase Edge Function for verification and JWT creation
      const res = await fetch('https://pulzjmzhbqunbjfqehmd.supabase.co/functions/v1/web3-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress, message, signature }),
      });

      console.log('Response received');

      
      console.log('API request sent, awaiting response...');
      
      const { token, error } = await res.json();

      if (error || !token) {
        throw new Error(error || 'Failed to retrieve token');
      }

      console.log('Received token:', token);

      // Use Supabase JWT sign-in
      const { data, error: authError } = await supabase.auth.signInWithIdToken({
        provider: 'web3',
        token,
      });

      if (authError) {
        throw authError;
      }

      setAddress(walletAddress); // Set the logged-in address
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

import { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

export default function Web3Login() {
  const [status, setStatus] = useState('');

  const loginWithWallet = async () => {
    try {
      if (!window.ethereum) return alert('MetaMask not detected');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      const message = `Login to PaperTrader with this wallet: ${address}`;
      const signature = await signer.signMessage(message);

      setStatus('🔗 Verifying...');

      const { data } = await axios.post(`${import.meta.env.VITE_RENDER_URL}/auth/web3`, {
        address,
        message,
        signature
      });

      if (data?.login_url) {
        setStatus('✅ Logging in...');
        window.location.href = data.login_url;
      } else {
        setStatus('❌ Login failed');
      }

    } catch (err) {
      console.error(err);
      setStatus('❌ Error occurred');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <button onClick={loginWithWallet} className="bg-black text-white px-4 py-2 rounded">
        Connect Wallet
      </button>
      <p>{status}</p>
    </div>
  );
}

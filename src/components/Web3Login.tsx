import { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Wallet } from 'lucide-react';

export default function Web3Login() {
  const [status, setStatus] = useState('');

  const loginWithWallet = async () => {
    try {
      if (!window.ethereum) return alert('Open in a Web3 Browser');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      

      const message = `Login to PaperTrader with this wallet: ${address}`;
      console.log("Signing message:", message);
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), address]
      });

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
      <button onClick={loginWithWallet} className="bg-[#ff7229] text-white text-sm px-4 py-2 rounded-full w-full flex justify-center gap-3 items-center max-md:text-[11px]">
        <Wallet className="h-4 w-4" />      
        Connect Wallet
      </button>
      <p>{status}</p>
    </div>
  );
}

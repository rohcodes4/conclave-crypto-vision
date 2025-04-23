import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

declare global {
    interface Window {
      TelegramLoginCallback: (user: any) => void;
      handleTelegramAuth: (user: any) => void;
    }
  }

  function onTelegramAuth(user) {
    fetch(`${import.meta.env.VITE_RENDER_URL}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(async data => {
      if (data.success && data.login_url) {
        window.location.href = data.login_url;
      }
      if (data.success && data.session?.access_token && data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
    
        const { data: { user }, error } = await supabase.auth.getUser();
       
        
        console.log('✅ Refetched user:', user);
      } else {
        console.error('❌ Invalid session returned from server:', data);
        // alert('Login failed: session data missing');
      }

   
      
    });
  }

const TelegramLogin = () => {
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute("data-telegram-login", "paperTrader_bot"); // without @
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-radius", "9999");
    script.setAttribute("data-onauth", "handleTelegramAuth(user)");
    script.async = true;
    document.getElementById("telegram-button-container").appendChild(script);

    // Add handler to window so Telegram can call it
    window.handleTelegramAuth = onTelegramAuth;
  }, [onTelegramAuth]);

  return <div className='flex justify-center !mt-6'><div id="telegram-button-container" className='w-full' /></div>;
};

export default TelegramLogin;
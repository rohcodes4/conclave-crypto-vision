import { supabase } from '@/integrations/supabase/client';
import { ExternalLink } from 'lucide-react';
import { useCallback, useEffect } from 'react';

declare global {
  interface Window {
    tgAuthHandled?: boolean;
  }
}

const TelegramLogin = () => {
  const handleTelegramAuth = async (userData: any) => {
    const res = await fetch(`${import.meta.env.VITE_RENDER_URL}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (data.success && data.login_url) {
      window.location.href = data.login_url;
    }

    if (data.success && data.session?.access_token && data.session?.refresh_token) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      const { data: { user } } = await supabase.auth.getUser();
      console.log('✅ Refetched user:', user);
    } else {
      console.error('❌ Invalid session returned from server:', data);
    }
  };

  const triggerTelegramLogin = () => {
    const bot = 'paperTrader_bot'; // without @
    const origin = encodeURIComponent(window.location.origin);
    const url = `https://oauth.telegram.org/auth?bot_id=8086922089&origin=${origin}&embed=0&request_access=write`;

    window.open(url, '_blank', 'width=500,height=500');
  };

  useEffect(() => {
    console.log('Checking for tgAuthResult in URL...');
    if (window.tgAuthHandled) {
      console.log('Auth already handled. Skipping.');
      return;
    }
  
    const hash = window.location.hash;
    console.log('Current hash:', hash);
  
    if (hash.startsWith('#tgAuthResult=')) {
      try {
        const encoded = hash.replace('#tgAuthResult=', '');
        console.log('Encoded:', encoded);
        const decoded = atob(encoded);
        console.log('Decoded:', decoded);
        const userData = JSON.parse(decoded);
        console.log('Parsed user data:', userData);
        window.tgAuthHandled = true;
        // window.history.replaceState(null, '', window.location.pathname);
        handleTelegramAuth(userData);
      } catch (err) {
        console.error('❌ Failed to parse tgAuthResult', err);
      }
    } else {
      console.log('No tgAuthResult in URL');
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userData: any = {};
    for (const [key, value] of params.entries()) {
      userData[key] = value;
    }

    console.log('Received Telegram User Data:', userData);

    // 🔥 Call your backend
    fetch(`${import.meta.env.VITE_RENDER_URL}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    .then(res => res.json())
    .then(async data => {
      if (data.success && data.login_url) {
        window.location.href = data.login_url;
      }

      if (data.success && data.session?.access_token && data.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

        const { data: { user } } = await supabase.auth.getUser();
        console.log('✅ Refetched user:', user);
      } else {
        console.error('❌ Invalid session returned from server:', data);
      }
    });
  }, []);
  
  

  return (
    <div className='flex justify-center mt-6'>
      <button
        onClick={triggerTelegramLogin}
        className='w-full px-4 py-2 bg-blue-500 text-white text-sm rounded-full shadow-md hover:bg-blue-600 flex gap-3 justify-center'
      >
        <ExternalLink className='h-4 w-4'/>
        Login with Telegram
      </button>
    </div>
  );
};

export default TelegramLogin;



// const TelegramLogin = () => {
//   const handleLogin = useCallback(() => {
//     const botName = 'paperTrader_bot';
//     const origin = encodeURIComponent(window.location.origin);
//     const telegramLoginUrl = `https://oauth.telegram.org/auth?bot_id=8086922089&origin=${origin}&embed=0&request_access=write`;

//     // Optional: open in popup or redirect
//     window.location.href = telegramLoginUrl;
//   }, []);

//   function onTelegramAuth(user) {
//     fetch(`${import.meta.env.VITE_RENDER_URL}/auth/telegram`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(user),
//     })
//       .then((res) => res.json())
//       .then(async (data) => {
//         if (data.success && data.login_url) {
//           window.location.href = data.login_url;
//         }
  
//         if (data.success && data.session?.access_token && data.session?.refresh_token) {
//           await supabase.auth.setSession({
//             access_token: data.session.access_token,
//             refresh_token: data.session.refresh_token,
//           });
  
//           const { data: { user }, error } = await supabase.auth.getUser();
//           console.log('✅ Refetched user:', user);
//         } else {
//           console.error('❌ Invalid session returned from server:', data);
//         }
//       });
//   }
  
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const tgUser = {
//       id: urlParams.get("id"),
//       first_name: urlParams.get("first_name"),
//       username: urlParams.get("username"),
//       photo_url: urlParams.get("photo_url"),
//       auth_date: urlParams.get("auth_date"),
//       hash: urlParams.get("hash"),
//     };
  
//     if (tgUser.id && tgUser.hash) {
//       onTelegramAuth(tgUser);
//     }

   
//   }, [window.location.href]);

//   useEffect(() => {
//     const hash = window.location.hash;

//     if (hash.startsWith('#tgAuthResult=')) {
//       try {
//         const encoded = hash.replace('#tgAuthResult=', '');
//         const jsonStr = decodeURIComponent(encoded);
//         const user = JSON.parse(jsonStr);
//         console.log('🔐 Telegram user:', user);
//         onTelegramAuth(user);
//       } catch (err) {
//         console.error('❌ Failed to parse tgAuthResult:', err);
//       }
//     }
//   }, []);
  

//   return (
//     <div className='flex justify-center mt-6'>
//       <button
//         onClick={handleLogin}
//         className='w-full px-4 py-2 bg-blue-500 text-white text-sm rounded-full shadow-md hover:bg-blue-600 flex gap-3 justify-center'
//       >
//         <ExternalLink className='h-4 w-4'/>
//         Login with Telegram
//       </button>
//     </div>
//   );
// };

// export default TelegramLogin;


// import { supabase } from '@/integrations/supabase/client';
// import { useEffect } from 'react';

// declare global {
//     interface Window {
//       TelegramLoginCallback: (user: any) => void;
//       handleTelegramAuth: (user: any) => void;
//     }
//   }

//   function onTelegramAuth(user) {
//     fetch(`${import.meta.env.VITE_RENDER_URL}/auth/telegram`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(user)
//     })
//     .then(res => res.json())
//     .then(async data => {
//       if (data.success && data.login_url) {
//         window.location.href = data.login_url;
//       }
//       if (data.success && data.session?.access_token && data.session?.refresh_token) {
//         await supabase.auth.setSession({
//           access_token: data.session.access_token,
//           refresh_token: data.session.refresh_token
//         });
    
//         const { data: { user }, error } = await supabase.auth.getUser();
       
        
//         console.log('✅ Refetched user:', user);
//       } else {
//         console.error('❌ Invalid session returned from server:', data);
//         // alert('Login failed: session data missing');
//       }

   
      
//     });
//   }

// const TelegramLogin = () => {
  
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://telegram.org/js/telegram-widget.js?7";
//     script.setAttribute("data-telegram-login", "paperTrader_bot"); // without @
//     script.setAttribute("data-size", "large");
//     script.setAttribute("data-userpic", "false");
//     script.setAttribute("data-radius", "9999");
//     script.setAttribute("data-onauth", "handleTelegramAuth(user)");
//     script.async = true;
//     document.getElementById("telegram-button-container").appendChild(script);

//     // Add handler to window so Telegram can call it
//     window.handleTelegramAuth = onTelegramAuth;
//   }, [onTelegramAuth]);

//   return <div className='flex justify-center !mt-6'><div id="telegram-button-container" className='w-full' /></div>;
// };

// export default TelegramLogin;
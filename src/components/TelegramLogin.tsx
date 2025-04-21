// import React from 'react'

// const TelegramLogin = () => {
//   return (
//     <div>TelegramLogin</div>
//   )
// }

// export default TelegramLogin

import { supabase } from '@/integrations/supabase/client';
import React, { useEffect, useState } from 'react';

declare global {
    interface Window {
      TelegramLoginCallback: (user: any) => void;
    }
  }
  

const TelegramLogin = () => {
  const [user, setUser] = useState(null);

  // This function is called by Telegram login widget
  const handleTelegramLogin = async (data) => {
    const { id, username, first_name, last_name, photo_url } = data;

    // Save to Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert([
        {
          telegram_id: id,
          username,
          full_name: first_name+ " "+last_name,
          avatar_url: photo_url
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
    } else {
      setUser({ username });
    }
  };

  // Mount Telegram widget + bind callback
  useEffect(() => {
    window.TelegramLoginCallback = handleTelegramLogin;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.async = true;
    script.setAttribute('data-telegram-login', 'paperTrader_bot'); // 🔁 Your bot username
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-onauth', 'TelegramLoginCallback(user)');
    document.getElementById('telegram-button').appendChild(script);
  }, []);

  return (
    <div>
      <h2>Login with Telegram</h2>
      <div id="telegram-button"></div>

      {user && (
        <div>
          <p>Welcome, {user.username}!</p>
        </div>
      )}
    </div>
  );
};

export default TelegramLogin;

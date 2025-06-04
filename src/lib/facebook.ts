import { create } from 'zustand';

// Facebook login response type
type FacebookAuthResponse = {
  accessToken: string;
  expiresIn: string;
  signedRequest: string;
  userID: string;
};

// Facebook post type
export type FacebookPost = {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url?: string;
};

// User profile type
export type FacebookUser = {
  id: string;
  name: string;
  picture?: {
    data: {
      url: string;
    };
  };
};

// Store for Facebook auth state
type FacebookStore = {
  isAuthenticated: boolean;
  user: FacebookUser | null;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => void;
  fetchPosts: () => Promise<FacebookPost[]>;
};

// Initialize Facebook SDK
export const initFacebookSDK = (): Promise<void> => {
  return new Promise((resolve) => {
    // Load the Facebook SDK asynchronously
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId: '1234567890', // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      
      resolve();
    };

    // Load the SDK
    (function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

// Create store for Facebook auth
export const useFacebookStore = create<FacebookStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  
  login: async () => {
    return new Promise<void>((resolve, reject) => {
      FB.login(async (response) => {
        if (response.authResponse) {
          const authResponse = response.authResponse as FacebookAuthResponse;
          
          try {
            // Get user profile
            const userResponse = await new Promise<FacebookUser>((resolve, reject) => {
              FB.api('/me', { fields: 'id,name,picture' }, (result) => {
                if (!result || result.error) {
                  reject(result?.error || new Error('Failed to fetch user profile'));
                  return;
                }
                resolve(result as FacebookUser);
              });
            });
            
            set({ 
              isAuthenticated: true,
              accessToken: authResponse.accessToken,
              user: userResponse
            });
            
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('User cancelled login or did not fully authorize'));
        }
      }, { scope: 'public_profile,user_posts' });
    });
  },
  
  logout: () => {
    FB.logout(() => {
      set({ isAuthenticated: false, accessToken: null, user: null });
    });
  },
  
  fetchPosts: async () => {
    if (!get().isAuthenticated || !get().accessToken) {
      throw new Error('User is not authenticated');
    }
    
    return new Promise<FacebookPost[]>((resolve, reject) => {
      FB.api(
        '/me/posts',
        'GET',
        { 
          fields: 'id,message,created_time,full_picture,permalink_url',
          limit: 10,
          access_token: get().accessToken 
        },
        (response) => {
          if (!response || response.error) {
            reject(response?.error || new Error('Failed to fetch posts'));
            return;
          }
          
          resolve(response.data as FacebookPost[]);
        }
      );
    });
  }
}));
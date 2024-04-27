import { AuthProvider } from "@refinedev/core";
import Cookies from 'js-cookie';
import { fetchApi } from '@/utils/fetchApi';

// @ts-ignore
const BASE_API = Q.api; // import.meta.env.VITE_API
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const TOKEN_KEY_UID = import.meta.env.VITE_TOKEN_EXP + import.meta.env.VITE_APP_Q;

const clearLocalData = () => {
  Cookies.remove(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export const authProvider: AuthProvider = {
  register: async ({ redirectPath, ...data }) => {
    const errorResponse = {
      success: false,
      error: {
        name: "RegisterError",
        message: "Failed register",
      },
    };

    try {
      const req = await fetchApi(BASE_API + '/register', {
        method: 'post',
        body: JSON.stringify(data),
      });
      // console.log('req: ', req);

      if(req?.data){
        return {
          success: true,
          redirectTo: redirectPath,
          successNotification: {
            message: "Registration Successful",
            description: "You have successfully registered",
          },
        };
      }

      return errorResponse;
    } catch(e){
      return errorResponse;
    }
  },
  login: async ({ username, email, password /** @DEV_OPTIONS : , remember, providerName */ }) => {
    const errorResponse = {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };

    const identity = username || email;

    if(identity && password){
      try {
        const req = await fetchApi(BASE_API + '/login', {
          method: 'post',
          body: JSON.stringify({ emailOrTelp: identity, password }),
        });
        // console.log('req: ', req);

        if(req?.data){
          Cookies.set(
            TOKEN_KEY, 
            req.data + TOKEN_KEY_UID, // parseData, 
            {
              expires: +import.meta.env.VITE_TOKEN_EXP, // new Date(new Date().getTime() + 3 * 60 * 1000)
              // path: "/",
              secure: true,
              sameSite: 'strict'
            }
          );

          // window.location.replace('/');
          return {
            success: true,
            redirectTo: "/dashboard", // / | /dashboard
          };
        }

        return {
          ...errorResponse,
          error: {
            ...errorResponse.error,
            message: "We apologize that an error occurred. Please try again."
          }
        };
      }catch(e){
        // console.log('e: ', e);
        return errorResponse;
      }
    }

    return errorResponse;
  },
  logout: async () => { // params: any
    clearLocalData();

    const bc = new BroadcastChannel(import.meta.env.VITE_BC_NAME);
    bc.postMessage({ type: "LOGOUT" });

    return {
      success: true,
      redirectTo: "/login/",
    };
  },
  check: async () => {
    const errorResponse = {
      authenticated: false,
      logout: true,
      redirectTo: "/login/",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };

    const token = Cookies.get(TOKEN_KEY);

    /** @DEV : strict token using key */
    if(token && token.includes(TOKEN_KEY_UID)){
      try {
        const req = await fetchApi(BASE_API + '/application-user/me', {
          headers: {
            Authorization: 'Bearer ' + token.replace(TOKEN_KEY_UID, ''),
          }
        });
        // console.log('req: ', req);
  
        if(req?.success){
          sessionStorage.setItem(TOKEN_KEY, JSON.stringify(req.data));
          return { authenticated: true }
        }

        // Clear data
        clearLocalData();
  
        return errorResponse;
      } catch(e){
        return errorResponse;
      }
    }

    return errorResponse;
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = Cookies.get(TOKEN_KEY);
    const user = sessionStorage.getItem(TOKEN_KEY);

    // console.log('token: ', token);
    // console.log('user: ', user);

    if (user && token && token.includes(TOKEN_KEY_UID)) {
      return JSON.parse(user);
    }

    return null;
  },
  forgotPassword: async ({ username }) => { // email
    const errorResponse = {
      success: false,
      error: {
        name: "ForgotPasswordError",
        message: "Username does not exist",
      },
    };

    try { // send password reset link to the user's email address here
      const req = await fetchApi(BASE_API + '/forgot-password/' + username);
      // console.log('req: ', req);
      if(req?.success){
        return {
          success: true,
          redirectTo: "/login/",
        };
      }
      
      return errorResponse;
    } catch(e){
      return errorResponse;
    }
  },
  onError: async (error) => {
    // console.log('%cauthProvider onError error: ', 'color:yellow', error);

    // Request abort / cancel
    // if (error.name === 'AbortError' || error.message === 'canceled') {
    //   return  {};
    // }

    if (error?.response?.status === 401) {
      return {
        error,
        authenticated: false,
        logout: true,
        redirectTo: "/login/",
      }
    }

    return { error };
  },
};

import { AuthProvider } from "@refinedev/core";
import Cookies from 'js-cookie';
// /utils/httpRequest
import { api } from '@/providers/dataProvider'; // , httpRequest
import { getToken, clearToken } from '@/utils/authToken';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

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
      const req: any = await api.post('register', {
        json: data,
      })
      .json();

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
        const req: any = await api.post('login', {
          json: { username: identity, password },
        }).json();

        // console.log('req: ', req);

        if(req?.data){
          Cookies.set(
            TOKEN_KEY, 
            req.data + import.meta.env.VITE_TOKEN_EXP + import.meta.env.VITE_APP_Q,
            {
              expires: +import.meta.env.VITE_TOKEN_EXP, // new Date(new Date().getTime() + 3 * 60 * 1000)
              // path: "/",
              sameSite: "strict",
              secure: window.location.protocol === "https", // true,
            }
          );

          // window.location.replace('/');
          return {
            success: true,
            redirectTo: "/dashboard",
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
    clearToken();

    const bc = new BroadcastChannel(import.meta.env.VITE_BC_NAME);
    bc.postMessage({ type: "LOGOUT" });

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const errorResponse = {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };

    const token = getToken();

    if(token){
      try {
        // httpRequest | api
        const req: any = await api('application-user/me', {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        })
        .json();
  
        // console.log('req: ', req);
  
        if(req?.success){
          sessionStorage.setItem(TOKEN_KEY, JSON.stringify(req.data));
          return { authenticated: true }
        }
  
        // Clear data
        clearToken();
  
        return errorResponse;
      } catch(e){
        return errorResponse;
      }
    }

    return errorResponse;
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = getToken();
    const user = sessionStorage.getItem(TOKEN_KEY);

    // console.log('token: ', token);
    // console.log('user: ', user);

    if (user && token) {
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
      const req: any = await api('forgot-password/' + username);
      // console.log('req: ', req);
      if(req?.success){
        return {
          success: true,
          redirectTo: "/login",
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

    const statusCode = error?.response?.status;

    if (statusCode === 401 || statusCode === 419) { // error?.response?.status === 401
      return {
        error,
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      }
    }

    return { error };
  },
};

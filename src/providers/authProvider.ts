import { AuthProvider } from "@refinedev/core";
import Cookies from 'js-cookie';
// /utils/httpRequest
import { api, httpRequest } from '@/providers/dataProvider'; // 
import { getToken, clearToken } from '@/utils/authToken';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const authProvider: AuthProvider = {
  register: async ({ redirectPath, ...json }) => {
    const errorResponse = {
      success: false,
      error: {
        name: "RegisterError",
        message: "Failed register",
      },
    };

    try {
      await api.get('sanctum/csrf-cookie'); // For cross domain

      // const csrfToken = Cookies.get('XSRF-TOKEN') as string;
      // console.log('csrfToken: ', csrfToken);

      const req: any = await httpRequest.post('register', { json }).json();

      console.log('req: ', req);

      return {
        success: true,
        redirectTo: redirectPath,
        successNotification: {
          message: "Registration Successful",
          description: "You have successfully registered",
        },
      };

      // if(req?.data){
      //   return {
      //     success: true,
      //     redirectTo: redirectPath,
      //     successNotification: {
      //       message: "Registration Successful",
      //       description: "You have successfully registered",
      //     },
      //   };
      // }

      // return errorResponse;
    } catch(e: any){
      // console.log('e: ', e);
      // return errorResponse;
      return {
        ...errorResponse,
        error: {
          // ...errorResponse.error,
          name: e.name || errorResponse.error.name,
          message: e.message || errorResponse.error.message
        }
      };
    }
  },
  
  login: async ({ email, username, password, remember /** @DEV_OPTIONS : , providerName */ }) => {
    const errorResponse = {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };

    if((username || email) && password){
      try {
        await api.get('sanctum/csrf-cookie'); // For cross domain

        const req: any = await httpRequest.post('api/login', {
          json: { email, username, password, remember },
        }).json();

        // console.log('req: ', req);

        if(req?.token){ // req?.data
          Cookies.set(
            TOKEN_KEY, 
            req.token + import.meta.env.VITE_TOKEN_EXP + import.meta.env.VITE_APP_Q,
            {
              expires: +import.meta.env.VITE_TOKEN_EXP, // new Date(new Date().getTime() + 3 * 60 * 1000)
              // path: "/",
              sameSite: "strict",
              secure: window.location.protocol !== "http:", // true,
            }
          );

          // window.location.replace('/');
          return {
            success: true,
            redirectTo: "/",
          };
        }

        return {
          ...errorResponse,
          error: {
            ...errorResponse.error,
            message: "We apologize that an error occurred. Please try again."
          }
        };
      }catch(e: any){
        console.log('e: ', e);
        // return errorResponse;
        return {
          ...errorResponse,
          error: {
            // ...errorResponse.error,
            name: e.name || errorResponse.error.name,
            message: e.message || errorResponse.error.message
          }
        };
      }
    }

    return errorResponse;
  },

  logout: async () => { // params: any
    const errorResponse = {
      success: false,
      error: {
        name: "LogoutError",
        message: "Logout failed",
      },
    };

    const token = getToken();

    if(token){
      try {
        await api.get('sanctum/csrf-cookie'); // For cross domain

        const req: any = await httpRequest.post('api/logout', {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        })
        .json();
  
        console.log('req: ', req);
  
        if(req?.success){
          clearToken();

          const bc = new BroadcastChannel(import.meta.env.VITE_BC_NAME);
          bc.postMessage({ type: "LOGOUT" });

          return {
            success: true,
            redirectTo: "/login",
            successNotification: {
              message: "Logout Successful",
              description: "You have successfully logged out",
            },
          };
        }
  
        return errorResponse;
      } catch(e){
        return errorResponse;
      }
    }

    return errorResponse;
  },
  
  check: async () => {
    const errorResponse = {
      authenticated: false,
      logout: true,
      // redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };

    const token = getToken();
    // console.log('check token: ', token);

    if(token){
      try {
        const req: any = await api('api/user', {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        })
        .json();
  
        // console.log('req: ', req);
  
        if(req?.id){ // req?.success
          sessionStorage.setItem(TOKEN_KEY, JSON.stringify(req));
          return { ...req, authenticated: true }
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

    // console.log('getIdentity token: ', token);
    // console.log('getIdentity user: ', user);

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

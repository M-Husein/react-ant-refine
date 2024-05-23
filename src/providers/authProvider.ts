import { AuthProvider } from "@refinedev/core";
import Cookies from 'js-cookie';
import { api, httpRequest } from '@/providers/dataProvider';
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
      /** @OPTION : For cross domain */
      // await api.get('sanctum/csrf-cookie');

      const req: any = await httpRequest.post('auth/register', { json }).json();
      // console.log('req: ', req);

      if(req?.data){
        const token = req.data.token;
        if(token){
          Cookies.set(
            TOKEN_KEY, 
            // token + import.meta.env.VITE_TOKEN_EXP + import.meta.env.VITE_APP_Q
            token + import.meta.env.VITE_APP_Q,
            {
              // expires: +import.meta.env.VITE_TOKEN_EXP, // new Date(new Date().getTime() + 3 * 60 * 1000)
              expires: 1,
              sameSite: "lax", // lax | strict
              secure: window.location.protocol !== "http:", // true,
            }
          );

          return {
            success: true,
            redirectTo: "/",
            successNotification: {
              message: "Registration Successful",
              description: "You have successfully registered",
            },
          };
        }

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
    } catch(e: any){
      // console.log('e: ', e);
      return errorResponse;
      // return {
      //   ...errorResponse,
      //   error: {
      //     // ...errorResponse.error,
      //     name: e.name || errorResponse.error.name,
      //     message: e.message || errorResponse.error.message
      //   }
      // };
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
        /** @OPTION : For cross domain */
        // await api.get('sanctum/csrf-cookie');

        const req: any = await httpRequest.post('auth/login', {
          json: { email, username, password, remember },
        }).json();

        // console.log('req: ', req);

        if(req?.data){ // req?.data
          Cookies.set(
            TOKEN_KEY, 
            // req.data.token + import.meta.env.VITE_TOKEN_EXP + import.meta.env.VITE_APP_Q,
            req.data.token + import.meta.env.VITE_APP_Q,
            {
              // expires: +import.meta.env.VITE_TOKEN_EXP, // new Date(new Date().getTime() + 3 * 60 * 1000)
              expires: 1,
              sameSite: "lax", // lax | strict
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
        return errorResponse;
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
        /** @OPTION : For cross domain */
        // await api.get('sanctum/csrf-cookie');

        /** @OPTION : make sure logout api success */
        // const req: any = await httpRequest.post('auth/logout', {
        //   keepalive: true,
        //   headers: {
        //     Authorization: 'Bearer ' + token,
        //   }
        // })
        // .json();

        await httpRequest.post('auth/logout', {
          keepalive: true,
          headers: {
            Authorization: 'Bearer ' + token,
          }
        });
  
        // console.log('req: ', req);

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
  
        /** @OPTION : make sure logout api success */
        // if(req?.success){
        //   clearToken();

        //   const bc = new BroadcastChannel(import.meta.env.VITE_BC_NAME);
        //   bc.postMessage({ type: "LOGOUT" });

        //   return {
        //     success: true,
        //     redirectTo: "/login",
        //     successNotification: {
        //       message: "Logout Successful",
        //       description: "You have successfully logged out",
        //     },
        //   };
        // }
        // return errorResponse;
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
        const req: any = await api('auth/user', {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        })
        .json();
  
        // console.log('req: ', req);
  
        if(req?.success){
          sessionStorage.setItem(TOKEN_KEY, JSON.stringify(req.data));
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
      const req: any = await api('auth/forgot-password/' + username);
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

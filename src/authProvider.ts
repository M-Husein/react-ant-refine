import { AuthProvider } from "@refinedev/core";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

export const authProvider: AuthProvider = {
  // register: async ({ redirectPath, ...data }) => {

  // },
  login: async ({ username, email, password }) => {
    if ((username || email) && password) {
      localStorage.setItem(TOKEN_KEY, username);
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);

    const bc = new BroadcastChannel(import.meta.env.VITE_BC_NAME);
    bc.postMessage({ type: "LOGOUT" });

    // window.location.replace('/login/');

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        id: 1,
        name: "Fairuz",
        username: 'fairuz',
        avatar: "/media/img/hijab_girl.jpg", // "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  // forgotPassword: async ({ username }) => { // email
  //   const errorResponse = {
  //     success: false,
  //     error: {
  //       name: "ForgotPasswordError",
  //       message: "Username does not exist",
  //     },
  //   };
  // },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};

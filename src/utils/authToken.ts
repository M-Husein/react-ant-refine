import Cookies from 'js-cookie';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
const TOKEN_KEY_UID = import.meta.env.VITE_TOKEN_EXP + import.meta.env.VITE_APP_Q;

/**
 * Get auth token
 * @returns string token | undefined
 */
export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  // console.log('token: ', token)

  if(token && token.includes(TOKEN_KEY_UID)){
    return token.replace(TOKEN_KEY_UID, '');
  }
}

/**
 * Clear auth token etc
 * @returns void
 */
export function clearToken(){
  Cookies.remove(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

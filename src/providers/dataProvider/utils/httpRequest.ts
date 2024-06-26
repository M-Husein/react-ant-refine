/**
 * @FROM : https://github.com/refinedev/refine/blob/master/packages/simple-rest/src/utils/axios.ts
 */
// import { HttpError } from "@refinedev/core";
import ky from 'ky';
import Cookies from 'js-cookie';

export const api = ky.create({ 
  // @ts-ignore
  prefixUrl: Q.api, // import.meta.env.VITE_API
  retry: 0,
  credentials: "include",
  // headers: {
  //   Accept: "application/json",
  //   "Content-Type": "application/json",
  // },
  hooks: {
    beforeError: [
      error => {
        const { response }: any = error;

        if(response?.body){
          let message = response.body.message;

          if(message){
            error.message = message;
          }else{
            let responseType = 'text';
            switch(response.headers.get('Content-Type')){
              case 'application/json':
                responseType = "json";
                break;
              default:
                break;
            }

            return response?.[responseType]?.().then((errorMessage: any) => {
              // console.log('errorMessage: ', errorMessage);
              return {
                ...error,
                ...errorMessage,
                statusCode: error.response?.status,
              };
            })
          }
        }
  
        return error;
      }
    ],

    // https://github.com/sindresorhus/ky?tab=readme-ov-file#hooksafterresponse
  }
});

export const httpRequest = api.extend({
  // @ts-ignore
  // prefixUrl: Q.api + '/api',
	hooks: {
		beforeRequest: [
			request => {
        // console.log('request: ', request);

        /** @OPTION : For csrf token */
        // request.credentials === "include" && 
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)){
          const csrfToken = Cookies.get('XSRF-TOKEN') as string;

          if(csrfToken){
            // request.credentials = "include";
            request.headers.set('X-XSRF-TOKEN', decodeURIComponent(csrfToken));
          }
        }
			}
		],
	},
});

/** @OLD */

// const httpRequest = axios.create();

// httpRequest.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (err) => {
//     // console.log('err: ', err)
//     // console.log('message: ', err.message)
//     // console.log('type: ', err.type)
//     // console.log('response: ', err.response)
//     // console.log('cause: ', err.cause)

//     const customError: HttpError = {
//       ...err,
//       message: err.response?.data?.message || err.message,
//       statusCode: err.response?.status,
//     };

//     return Promise.reject(customError);
//   },
// );
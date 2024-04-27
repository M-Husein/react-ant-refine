import { AxiosInstance } from "axios";
import { DataProvider } from "@refinedev/core";
import Cookies from 'js-cookie';
import { httpRequest, generateSort, generateFilter } from "./utils";

class CustomError extends Error { // @ts-ignore
  constructor(name: string, message: string, cause?: any) {
    super(message);
    this.name = name; // @ts-ignore
    this.cause = cause;
  }
}

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";
type MethodCommons = "get" | "post" | "put" | "patch"; //  | "head" | "options" | "delete"

// Omit<
//   Required<DataProvider>,
//   "createMany" | "updateMany" | "deleteMany"
// >

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = httpRequest, // axiosInstance
): DataProvider => {
  const ERROR_UNSPECIFIC = "Terjadi kesalahan"; // Something went wrong
  const TOKEN_KEY_UID = import.meta.env.VITE_TOKEN_EXP + import.meta.env.VITE_APP_Q;
  
  const setupHeaders = (headersFromMeta: any) => {
    // console.log('httpClient.defaults.headers: ', httpClient.defaults.headers)

    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY) as string;
    httpClient.defaults.headers.common.Authorization = token && token.includes(TOKEN_KEY_UID) ? 'Bearer ' + token.replace(TOKEN_KEY_UID, '') : '';

    if (headersFromMeta) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headersFromMeta,
      };
    }
  }

  return {
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const url = apiUrl + '/' + resource;
  
      const {
        current = 1,
        pageSize = 10,
        mode = "server",
      } = pagination ?? {};
  
      const { headers: headersFromMeta, method, payload, queryContext, params, ...requestOptions } = meta ?? {};
      // const requestMethod = (method as MethodTypes) ?? "get";
      const requestMethod = (method as MethodCommons) ?? "get";
  
      setupHeaders(headersFromMeta);
  
      try {
        const signal = queryContext?.signal; // For abort request
  
        let response;
        switch (method) {
          case "put":
          case "post":
          case "patch":
            response = await httpClient[requestMethod](url, payload, { signal, params, ...requestOptions });
            break;
          default:
            const queryFilters = generateFilter(filters);
            
            const query: {
              _start?: number;
              _end?: number;
              _sort?: string;
              _order?: string;
            } = {};

            if (mode === "server") {
              query._start = (current - 1) * pageSize;
              query._end = current * pageSize;
            }

            const generatedSort = generateSort(sorters);
            if (generatedSort) {
              const { _sort, _order } = generatedSort;
              query._sort = _sort.join(",");
              query._order = _order.join(",");
            }
            
            response = await httpClient.get(url, { signal, params: { ...params, ...query, ...queryFilters } });
            break;
        }
        
        const { data, headers } = response;
        // console.log('getList data: ', data)
  
        if(data?.success){ //  || data?.success !== 'undefined'
          const resData = data?.data;
          return {
            ...data, // data
            total: +headers["x-total-count"] || resData?.length || resData?.data?.length,
          };       
        }
  
        // throw new Error(i18n.t('error.unspecific'));
        throw new CustomError('ReadError', ERROR_UNSPECIFIC, data);
      } catch(e){
        throw e;
      }
    },
  
    getMany: async ({ resource, ids, meta }) => {
      const { headers, method, queryContext, params, ...requestOptions } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";
  
      setupHeaders(headers);
  
      try {
        const { data } = await httpClient[requestMethod](
          apiUrl + '/' + resource,
          { signal: queryContext?.signal, params: { ...params, id: ids }, ...requestOptions }
        );
        
        if(data?.success){
          return data; // { data };
        }
        
        throw new CustomError('ReadError', ERROR_UNSPECIFIC, data);
      } catch(e){
        throw e;
      }
    },
  
    create: async ({ resource, variables, meta }) => {
      const { headers, method, ...requestOptions } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodCommons) ?? "post"; // MethodTypesWithBody | MethodCommons
      
      setupHeaders(headers);

      // console.log('create requestOptions: ', requestOptions)
  
      try {
        const { data } = await httpClient[requestMethod](
          apiUrl + '/' + resource, 
          // @ts-ignore
          variables,
          /** @DEV : must check & test (use or not) */
          requestOptions
          // { signal: queryContext?.signal, ...requestOptions }
          // { ...queryContext, ...requestOptions }
        );

        // console.log('queryContext: ', queryContext)
        /** @DEV : signal not work if method get */
        // const { data } = await httpClient({
        //   ...requestOptions,
        //   method: requestMethod,
        //   url: apiUrl + '/' + resource,
        //   data: variables,
        //   signal: requestMethod === 'get' ? queryContext?.signal : requestOptions.signal,
        // });
  
        if(data?.success){
          return data; // { data };
        }
        
        throw new CustomError('CreateError', ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    },
  
    update: async ({ resource, id, variables, meta }) => {
      const { headers, method } = meta ?? {}; // , queryContext, ...requestOptions
      const requestMethod = (method as MethodTypesWithBody) ?? "put"; // patch
  
      setupHeaders(headers);
  
      try {
        const { data } = await httpClient[requestMethod](
          `${apiUrl}/${resource}${id ? '/' + id : ''}`,
          variables,
          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal, ...requestOptions }
          // { ...queryContext, ...requestOptions }
        );
  
        if(data?.success){
          return data; // { data };
        }
        
        throw new CustomError('UpdateError', ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    },
  
    getOne: async ({ resource, id, meta }) => {
      const { headers, method, queryContext, ...requestOptions } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";
  
      setupHeaders(headers);
  
      try {
        const { data } = await httpClient[requestMethod](
          `${apiUrl}/${resource}${id ? '/' + id : ''}`,
          { signal: queryContext?.signal, ...requestOptions }
        );
  
        if(data?.success){
          return data; // { data };
        }
        
        throw new CustomError('ReadError', ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    },
    
    deleteOne: async ({ resource, id, variables, meta }) => {
      const { headers, method } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodTypesWithBody) ?? "delete";
  
      setupHeaders(headers);
  
      try {
        const { data } = await httpClient[requestMethod](
          `${apiUrl}/${resource}/${id}`, 
          {
            data: variables,
          },
          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal }
        );
  
        if(data?.success){
          return data; // { data };        
        }
        
        throw new CustomError('DeleteError', ERROR_UNSPECIFIC, data);
      } catch(e){
        throw e;
      }
    },
  
    deleteMany: async ({ resource, ids, meta }) => { // variables
      const { headers, method } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodTypesWithBody) ?? "delete";
  
      setupHeaders(headers);
  
      try {
        const { data } = await httpClient[requestMethod](
          apiUrl + '/' + resource, 
          { data: ids }, // , variables
          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal }
        );
  
        if(data?.success){
          return data; // { data };        
        }
        
        throw new CustomError('DeleteManyError', ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    },
  
    getApiUrl: () => {
      return apiUrl;
    },
  
    custom: async ({
      url,
      method,
      filters,
      sorters,
      payload,
      query,
      headers,
      meta: { queryContext, signal: abortSignal, params, ...requestOptions } = {},
    }) => {
      setupHeaders(headers);

      const signal = abortSignal || queryContext?.signal;
  
      try {
        let axiosResponse;
        switch (method) {
          case "put":
          case "post":
          case "patch":
            axiosResponse = await httpClient[method](url, payload, { signal, params, ...requestOptions });
            break;
          case "delete":
            axiosResponse = await httpClient.delete(url, {
              data: payload,
              signal,
            });
            break;
          default:
            let sortQuery = {};
            if (sorters) {
              const generatedSort = generateSort(sorters);
              if (generatedSort) {
                const { _sort, _order } = generatedSort;
                sortQuery = {
                  _sort: _sort.join(","),
                  _order: _order.join(","),
                };
              }
            }
        
            const filterQuery = filters ? generateFilter(filters) : {};

            axiosResponse = await httpClient.get(url, { signal, params: { ...params, ...filterQuery, ...sortQuery, ...query } });
            break;
        }
  
        const { data } = axiosResponse;
  
        if(data?.success){
          return Promise.resolve(data); // { data }    
        }
        
        throw new CustomError(method, ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    },
  }
};

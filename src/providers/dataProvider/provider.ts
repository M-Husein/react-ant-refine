// import { AxiosInstance } from "axios";
import { DataProvider } from "@refinedev/core";
import { getToken, clearToken } from '@/utils/authToken';
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
type MethodCommons = "get" | "post" | "put" | "patch";

// Omit<
//   Required<DataProvider>,
//   "createMany" | "updateMany" | "deleteMany"
// >

const ERROR_UNSPECIFIC = "Terjadi kesalahan"; // Something went wrong

export const dataProvider = (
  apiUrl: string,
  httpClient = httpRequest, // : AxiosInstance = httpRequest
): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    if(getToken()){
      const {
        current = 1,
        pageSize = 10,
        mode = "server",
      } = pagination ?? {};
  
      // headers: headersFromMeta, payload, params
      const { method, queryContext, searchParams, ...requestOptions } = meta ?? {};
      // const requestMethod = (method as MethodTypes) ?? "get";
      const requestMethod = (method as MethodCommons) ?? "get";
  
      try {
        const signal = queryContext?.signal; // For abort request
  
        let response: any;
        switch (method) {
          case "put":
          case "post":
          case "patch":
            response = await httpClient(resource, { 
              method: requestMethod, 
              signal, 
              searchParams, 
              ...requestOptions
            }).json();
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
            
            response = await httpClient.get(resource, { 
              signal, 
              searchParams: { ...searchParams, ...query, ...queryFilters },
              ...requestOptions
            }).json();
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
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    if(getToken()){
      const { method, queryContext, searchParams, ...requestOptions } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";
  
      try {
        const { data }: any = await httpClient(
          resource, // apiUrl + '/' + resource,
          { 
            method: requestMethod,
            signal: queryContext?.signal, 
            searchParams: { ...searchParams, id: ids }, 
            ...requestOptions
          }
        )
        .json();
        
        if(data?.success){
          return data; // { data };
        }
        
        throw new CustomError('ReadError', ERROR_UNSPECIFIC, data);
      } catch(e){
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
    }
  },

  // { resource, variables, meta } | body, json
  create: async ({ resource, variables, meta }) => {
    if(getToken()){
      const { method, ...requestOptions } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodCommons) ?? "post"; // MethodTypesWithBody | MethodCommons

      // console.log('create requestOptions: ', requestOptions)
  
      try {
        // const { data }: any = await httpClient[requestMethod](
        //   apiUrl + '/' + resource, 
        //   // @ts-ignore
        //   variables,
        //   /** @DEV : must check & test (use or not) */
        //   requestOptions
        //   // { signal: queryContext?.signal, ...requestOptions }
        //   // { ...queryContext, ...requestOptions }
        // );

        // const parsePayload = typeof variables === 'string' ? {
        //   body: variables
        // }

        const { data }: any = await httpClient(
          resource, // apiUrl + '/' + resource, 
          {
            method: requestMethod,
            // body,
            json: variables,
            ...requestOptions
          }
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
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    if(getToken()){
      const { headers, method } = meta ?? {}; // , queryContext, ...requestOptions
      const requestMethod = (method as MethodTypesWithBody) ?? "put"; // patch
  
      // setupHeaders(headers);
  
      try {
        // const { data } = await httpClient[requestMethod](
        //   `${apiUrl}/${resource}${id ? '/' + id : ''}`,
        //   variables,
        //   /** @DEV : must check & test (use or not) */
        //   // { signal: queryContext?.signal, ...requestOptions }
        //   // { ...queryContext, ...requestOptions }
        // );

        const { data }: any = await httpClient(
          resource + (id ? '/' + id : ''), // `${apiUrl}/${resource}${id ? '/' + id : ''}`,
          {
            method: requestMethod,
            json: variables,
            headers,
          }
          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal, ...requestOptions }
          // { ...queryContext, ...requestOptions }
        );
  
        if(data?.success){
          return data;
        }
        
        throw new CustomError('UpdateError', ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
    }
  },

  getOne: async ({ resource, id, meta }) => {
    if(getToken()){
      const { method, queryContext, ...requestOptions } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";
  
      try {
        const { data }: any = await httpClient(
          resource + (id ? '/' + id : ''), // `${apiUrl}/${resource}${id ? '/' + id : ''}`,
          { 
            method: requestMethod,
            signal: queryContext?.signal, 
            ...requestOptions
          }
        );
  
        if(data?.success){
          return data;
        }
        
        throw new CustomError('ReadError', ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
    }
  },
  
  deleteOne: async ({ resource, id, variables, meta }) => {
    if(getToken()){
      const { headers, method } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodTypesWithBody) ?? "delete";
  
      try {
        const { data }: any = await httpClient(
          resource + "/" + id, // `${apiUrl}/${resource}/${id}`, 
          {
            method: requestMethod,
            headers,
            json: variables,
          },
          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal }
        );
  
        if(data?.success){
          return data;      
        }
        
        throw new CustomError('DeleteError', ERROR_UNSPECIFIC, data);
      } catch(e){
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
    }
  },

  deleteMany: async ({ resource, ids, meta }) => { // variables
    if(getToken()){
      const { headers, method } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodTypesWithBody) ?? "delete";
  
      try {
        const { data }: any = await httpClient(
          apiUrl + '/' + resource, 
          { 
            method: requestMethod,
            headers,
            json: ids
          }, // , variables

          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal }
        );
  
        if(data?.success){
          return data;      
        }
        
        throw new CustomError('DeleteManyError', ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
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
    meta: { queryContext, signal: abortSignal, searchParams, ...requestOptions } = {},
  }) => {
    if(getToken()){
      const signal = abortSignal || queryContext?.signal;

      try {
        let httpResponse;
        switch (method) {
          case "put":
          case "post":
          case "patch":
            httpResponse = await httpClient(url, { 
              method, 
              json: payload,
              headers,
              signal, 
              searchParams, 
              ...requestOptions
            });
            break;
          case "delete":
            httpResponse = await httpClient.delete(url, {
              // data: payload,
              // body,
              json: payload,
              headers,
              signal,
              ...requestOptions
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

            httpResponse = await httpClient.get(url, { 
              headers,
              signal,
              searchParams: { ...searchParams, ...filterQuery, ...sortQuery, ...query },
              ...requestOptions
            });
            break;
        }
  
        const { data }: any = httpResponse;
  
        if(data?.success){
          return Promise.resolve(data); 
        }
        
        throw new CustomError(method, ERROR_UNSPECIFIC, data);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', ERROR_UNSPECIFIC);
    }
  },
});

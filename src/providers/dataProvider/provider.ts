// import { AxiosInstance } from "axios";
import { DataProvider } from "@refinedev/core";
import { getToken, clearToken } from '@/utils/authToken';
import { httpRequest, generateSort, generateFilter } from "./utils";
import i18n from "@/i18n";

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

// const ERROR_UNSPECIFIC = "Terjadi kesalahan"; // Something went wrong

export const dataProvider = (
  apiUrl: string,
  httpClient = httpRequest, // : AxiosInstance = httpRequest
): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const token = getToken();
    if(token){
      const {
        current = 1,
        pageSize = 10,
        mode = "server",
      } = pagination ?? {};
  
      // payload, params
      const { method, queryContext, searchParams, headers, ...requestOptions } = meta ?? {};
      // const requestMethod = (method as MethodTypes) ?? "get";
      const requestMethod = (method as MethodCommons) ?? "get";
  
      try {
        const commonOptions = {
          signal: queryContext?.signal, // For abort request
          headers: {
            ...headers,
            Authorization: 'Bearer ' + token,
          },
          ...requestOptions
        };

        const isGetMethod = requestMethod === "get";
        const paginationOff = mode === "off";
  
        let response: any;

        if(requestMethod === "post"){
          response = await httpClient.post(resource, { 
            ...commonOptions,
            searchParams,
          }).json();
        }
        else if(isGetMethod){
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

          // const fixQueryParams = { ...searchParams, ...query, ...queryFilters };
          
          response = await httpClient.get(resource, { 
            ...commonOptions,
            // searchParams: { ...searchParams, ...query, ...queryFilters },
            // searchParams: Object.keys(fixQueryParams).length ? fixQueryParams : undefined,
            searchParams: paginationOff ? searchParams : { ...searchParams, ...query, ...queryFilters },
          }).json();
        }
        
        // const { data, headers: headersResponse, ...otherResponse } = response;
        // console.log('getList response: ', response)
  
        if(response?.success){
          const resData = response?.data;
          const parseDatas = isGetMethod ? response : resData;

          if(paginationOff){
            return parseDatas;
          }

          return {
            ...parseDatas,
            total: resData?.recordsFiltered || resData?.data?.length || 0,
            // total: +headersResponse["x-total-count"] || resData?.length || resData?.data?.length,
          };
        }
  
        // // throw new Error(i18n.t('error.unspecific'));
        throw new CustomError('ReadError', i18n.t('error.unspecific'), response);
      } catch(e){
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
    }
  },

  getMany: async ({ resource, ids, meta }) => {
    const token = getToken();
    if(token){
      const { method, queryContext, searchParams, headers, ...requestOptions } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";
  
      try {
        const { data }: any = await httpClient(
          resource, // apiUrl + '/' + resource,
          { 
            ...requestOptions,
            method: requestMethod,
            signal: queryContext?.signal, 
            searchParams: { ...searchParams, id: ids }, 
            headers: {
              ...headers,
              Authorization: 'Bearer ' + token,
            },
          }
        )
        .json();
        
        if(data?.success){
          return data;
        }
        
        throw new CustomError('ReadError', i18n.t('error.unspecific'), data);
      } catch(e){
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
    }
  },

  // { resource, variables, meta } | body, json
  create: async ({ resource, variables, meta }) => {
    const token = getToken();
    if(token){
      const { method, headers, body, ...requestOptions } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodCommons) ?? "post"; // MethodTypesWithBody | MethodCommons
  
      try {
        const req: any = await httpClient(
          resource,
          {
            ...requestOptions,
            method: requestMethod,
            body,
            json: body ? undefined : variables,
            headers: {
              ...headers,
              Authorization: 'Bearer ' + token,
            },
          }
        ).json();

        // console.log('req: ', req)

        // console.log('queryContext: ', queryContext)
        /** @DEV : signal not work if method get */
        // const { data } = await httpClient({
        //   ...requestOptions,
        //   method: requestMethod,
        //   url: apiUrl + '/' + resource,
        //   data: variables,
        //   signal: requestMethod === 'get' ? queryContext?.signal : requestOptions.signal,
        // });
  
        if(req?.success){
          return req;
        }
        
        throw new CustomError('CreateError', i18n.t('error.unspecific'), req);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    const token = getToken();
    if(token){
      const { method, headers } = meta ?? {}; // , queryContext, ...requestOptions
      const requestMethod = (method as MethodTypesWithBody) ?? "put";
  
      try {
        const req: any = await httpClient(
          resource + (id ? '/' + id : ''), // `${apiUrl}/${resource}${id ? '/' + id : ''}`,
          {
            method: requestMethod,
            json: variables,
            headers: {
              ...headers,
              Authorization: 'Bearer ' + token,
            },
          }
          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal, ...requestOptions }
          // { ...queryContext, ...requestOptions }
        ).json();
  
        if(req?.success){
          return req;
        }
        
        throw new CustomError('UpdateError', i18n.t('error.unspecific'), req);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const token = getToken();
    if(token){
      const { method, queryContext, headers, ...requestOptions } = meta ?? {};
      const requestMethod = (method as MethodTypes) ?? "get";
  
      try {
        const req: any = await httpClient(
          resource + (id ? '/' + id : ''),
          { 
            ...requestOptions,
            method: requestMethod,
            signal: queryContext?.signal, 
            headers: {
              ...headers,
              Authorization: 'Bearer ' + token,
            },
          }
        ).json();
  
        if(req?.success){
          return req;
        }
        
        throw new CustomError('ReadError', i18n.t('error.unspecific'), req);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
    }
  },
  
  deleteOne: async ({ resource, id, variables, meta }) => {
    const token = getToken();
    if(token){
      const { method, headers } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodTypesWithBody) ?? "delete";
  
      try {
        const req: any = await httpClient(
          resource + "/" + id,
          {
            method: requestMethod,
            json: variables,
            headers: {
              ...headers,
              Authorization: 'Bearer ' + token,
            },
          },
          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal }
        ).json();
  
        if(req?.success){
          return req;      
        }
        
        throw new CustomError('DeleteError', i18n.t('error.unspecific'), req);
      } catch(e){
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
    }
  },

  deleteMany: async ({ resource, ids, meta }) => { // variables
    const token = getToken();
    if(token){
      const { method, headers } = meta ?? {}; // , queryContext
      const requestMethod = (method as MethodTypesWithBody) ?? "delete";
  
      try {
        const req: any = await httpClient(
          resource, 
          { 
            method: requestMethod,
            json: ids,
            headers: {
              ...headers,
              Authorization: 'Bearer ' + token,
            },
          }, // , variables

          /** @DEV : must check & test (use or not) */
          // { signal: queryContext?.signal }
        ).json();
  
        if(req?.success){
          return req;      
        }
        
        throw new CustomError('DeleteManyError', i18n.t('error.unspecific'), req);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
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
    // headers,
    meta: { queryContext, signal: abortSignal, searchParams, headers, ...requestOptions } = {},
  }) => {
    const token = getToken();
    if(token){
      const commonOptions = {
        ...requestOptions,
        signal: abortSignal || queryContext?.signal,
        headers: {
          ...headers,
          Authorization: 'Bearer ' + token,
        },
      };

      try {
        let httpResponse;
        switch (method) {
          case "put":
          case "post":
          case "patch":
            httpResponse = await httpClient(url, { 
              ...commonOptions,
              method, 
              json: payload,
              searchParams, 
            })
            .json();
            
            break;

          case "delete":
            httpResponse = await httpClient.delete(url, {
              ...commonOptions,
              // data: payload,
              // body,
              json: payload,
            })
            .json();

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
              ...commonOptions,
              searchParams: { ...searchParams, ...filterQuery, ...sortQuery, ...query },
            })
            .json();

            break;
        }
  
        const req: any = httpResponse;
  
        if(req?.success){
          return Promise.resolve(req); 
        }
        
        throw new CustomError(method, i18n.t('error.unspecific'), req);
      } catch(e) {
        throw e;
      }
    }
    else{
      clearToken();
      throw new CustomError('ReadError', i18n.t('error.unspecific'));
    }
  },
});

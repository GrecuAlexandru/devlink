type InterceptorProps = {
  onRequest?: (args: [input: RequestInfo | URL, init?: RequestInit | undefined]) => [input: RequestInfo | URL, init?: RequestInit | undefined];
  onResponse?: (response: Response) => Response | Promise<Response>;
  onResponseError?: (error: unknown) => unknown;
};

const { fetch: originalFetch } = window;

export const useInterceptor = (props: InterceptorProps) => {
  if (window.fetch === originalFetch) {
    window.fetch = async (...args) => {
      const [resource, config] = props.onRequest ? props.onRequest(args) : args;

      try {
        const response = await originalFetch(resource, config);
        return props.onResponse ? props.onResponse(response) : response;
      } catch (error: unknown) {
        throw props.onResponseError ? props.onResponseError(error) : error;
      }
    };

    console.log("Fetch interceptor set!");
  }
};

import { createOpenAPI } from 'fumadocs-openapi/server';


export const openapi = createOpenAPI({
  // the OpenAPI schema, you can also give it an external URL.
  // input: ['https://raw.githubusercontent.com/ceva24/openapi-steamworks-web-api/refs/heads/main/dist/steamworks-web-api.json'],
  input:['./openapi.json'],
    proxyUrl: '/api/proxy',

});
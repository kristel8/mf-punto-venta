const envGlobal: {[key: string]: any} = window;
export const environment = {
  production: true,
  urlGateway: envGlobal['urlGateway'],
  urlReport: envGlobal['urlReport']
};

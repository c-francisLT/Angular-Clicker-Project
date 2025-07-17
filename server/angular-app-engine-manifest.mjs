
export default {
  basePath: 'https://cfrancis-lt.github.io/Angular-Clicker-Project',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};

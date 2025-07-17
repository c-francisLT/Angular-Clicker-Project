
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://cfrancis-lt.github.io/Angular-Clicker-Project/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Angular-Clicker-Project"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 496, hash: '1ad430965c9a61a99d1b9adc6a7e0e142a8ddb9c2b9a451d2c73461f09eb5ee5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1009, hash: '832ba0de4e74f8c83d05529d46f6cb5452eaaab1b22473cd7430420ed9dea5e6', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 4263, hash: '90ea7b50b53bd76446b767f6fda3063f9248cb5f592ab293f5fb0628858fd587', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};

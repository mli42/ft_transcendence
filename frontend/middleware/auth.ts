export default async function (context: any) {
  const port = 3000;
  const loc = window.location;
  context.app.$axios.defaults.baseURL = loc.protocol + '//' + loc.hostname + ':' + port;

  const isLoginPage = (context.route.fullPath === '/login');
  const isLogged: boolean = await context.app.$axios.get('/api/user/isLogin')
  .then(() => true)
  .catch(() => false);

  context.store.commit('updateLogState', isLogged);
  if (isLogged) {
    if (isLoginPage)
      context.redirect('/');
  } else { // Not logged
    if (!isLoginPage)
      context.redirect('/login');
  }
};

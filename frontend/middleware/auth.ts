export default async function (context: any) {
  const port = 3000;
  const loc = window.location;
  context.app.$axios.defaults.baseURL = loc.protocol + '//' + loc.hostname + ':' + port;

  const isLoginPage = (context.route.fullPath === '/login');
  const isLogged: boolean = await context.app.$axios.get('/api/user/isLogin')
  .then(() => true)
  .catch(() => false);

  if (isLoginPage) {
    if (isLogged)
      context.redirect('/');
    return ;
  }
  // Not LoginPage
  if (!isLogged) {
    context.redirect('/login');
    return ;
  }
  const res: any = await context.app.$axios.get('/api/user/currentUser');
  context.store.commit('updateUser', res.data);
};

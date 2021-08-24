export default async function (context: any) {
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

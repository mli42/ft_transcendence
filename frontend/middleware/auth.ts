export default async function (context: any) {
  const isLoginPage = (context.route.fullPath === '/login');
  const is2faPage: boolean = (context.route.fullPath === '/authentification');

  const isLogged: string = await context.app.$axios.get('/api/user/isLogin')
  .then(() => 'OK')
  .catch((err: any) => {
    if (err.response.data.message === 'need 2FA') {
      return '2FA';
    }
    return 'NO';
  });
  context.store.commit('updateLogState', (isLogged === 'OK'));

  if (isLogged == '2FA') {
    if (is2faPage === false)
      context.redirect('/authentification');
    return;
  }

  if (isLogged == 'OK') {
    if (isLoginPage)
      context.redirect('/');
  } else { // Not logged
    if (!isLoginPage)
      context.redirect('/login');
  }
};

enum elogState {
  logged,
  need2FA,
  loggedout,
};

function isLoginCatch(err: any): elogState {
  if (err.response.data.message === 'need 2FA')
    return elogState.need2FA;
  return elogState.loggedout;
}

export default async function (context: any) {
  const isLoginPage = (context.route.fullPath === '/login');
  const is2faPage: boolean = (context.route.fullPath === '/authentification');
  const isLogged: elogState = await context.app.$axios.get('/api/user/isLogin')
  .then(() => elogState.logged)
  .catch(isLoginCatch);

  context.store.commit('updateLogState', (isLogged === elogState.logged));

  if (isLogged === elogState.need2FA) {
    if (is2faPage === false)
      context.redirect('/authentification');
    return;
  }

  if (isLogged === elogState.logged) {
    if (isLoginPage || is2faPage)
      context.redirect('/');
  } else { // Not logged
    if (!isLoginPage)
      context.redirect('/login');
  }
};

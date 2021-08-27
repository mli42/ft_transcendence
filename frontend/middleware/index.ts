import io from 'socket.io-client';
function adminGuard(context: any, user: any): void {
  const isAdminView: boolean = (context.route.fullPath === '/admin');

  if (isAdminView && user.isAdmin === false) {
    context.redirect('/');
    context.$mytoast.err('Unauthorized');
  }
}

export default async function (context: any) {
  if (context.store.state.isLogged == false)
    return ;
  const userResp: any = await context.app.$axios.get('/api/user/currentUser');
  const user = userResp.data;
  const avatarBaseURL: string = context.$user.avatarBaseURL;
  const avatarURL: string = `${avatarBaseURL}/${user.profile_picture}`;

  if (context.$user.socket === null)
    context.$user.socket = io(`ws://${window.location.hostname}:3000/`, {withCredentials: true});
  adminGuard(context, user);
  context.store.commit('updateUser', user);
  context.store.commit('updateAvatarURL', avatarURL);
};

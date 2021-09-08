import io from 'socket.io-client';

function adminGuard(context: any, user: any): void {
  const isAdminView: boolean = (context.route.fullPath === '/admin');

  if (isAdminView && user.isAdmin === false) {
    context.redirect('/');
    context.$mytoast.err('Unauthorized');
  }
}

export default async function (context: any) {
  if (context.store.state.isLogged == false) {
    if (context.$user.socket !== null) {
      context.$user.socket.off('userConnected');
      context.$user.socket.off('userInGame');
      context.$user.socket.emit('disconnectUser');
      // console.log("My socket", context.$user.socket);
      setTimeout(() => { context.$user.socket = null; }, 500);
    }
    return;
  }
  const user: any = await context.app.$axios.get('/api/user/currentUser')
  .then((res: any) => res.data)
  .catch((err: any) => {
    return context.error({ statusCode: err.response.status, message: err.response.statusText });
  });
  const avatarBaseURL: string = context.$user.avatarBaseURL;
  const avatarURL: string = `${avatarBaseURL}/${user.profile_picture}`;

  adminGuard(context, user);
  context.store.commit('updateUser', user);
  context.store.commit('updateAvatarURL', avatarURL);

  if (context.$user.socket === null) {
    context.$user.socket = io(`ws://${window.location.hostname}:3000/chat`, {
      withCredentials: true,
      query: {
        gameId: context.from.params.id,
        userId: user.userId,
        username: user.username,
      },
    });
    context.$user.socket.on('userConnected', (users: any) => {
      context.store.commit('updateConnectedUsers', users);
    });
    context.$user.socket.on('userInGame', (users: any) => {
      context.store.commit('updatePlayingUsers', users);
    });
  }
};

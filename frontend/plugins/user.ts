// Inject in Vue, context and store.
import io from 'socket.io-client';

function shortName(username: string, max_length: number = 10): string {
  if (!username)
    return '';
  if (username.length <= max_length)
    return username;
  return username.substr(0, max_length - 3) + "...";
};

function logout(context: any): Function {
  return function () {
    context.$axios
    .delete('/api/user/logout')
    .then((response: any): void => {
      context.redirect('/login');
      context.$mytoast.info('Logged out');
    })
    .catch((error: any): void => {
      console.log("LOGOUT FAILURE");
    });
  }
}

function socketCreate(context: any): Function {
  return () => {
    if (context.$user.socket !== null)
      return;
    context.$user.socket = io(`ws://${window.location.hostname}:3000/chat`, {
      forceNew: true,
      withCredentials: true,
    });
    context.$user.socket.on('userConnected', (users: any) => {
      context.store.commit('updateConnectedUsers', users);
    });
    context.$user.socket.on('userInGame', (users: any) => {
      context.store.commit('updatePlayingUsers', users);
    });
  };
}

function socketDelete(context: any): Function {
  return () => {
    if (context.$user.socket === null)
      return ;
    context.$user.socket.off('userConnected');
    context.$user.socket.off('userInGame');
    context.$user.socket.emit('disconnectUser');
    setTimeout(() => { context.$user.socket = null; }, 500);
  };
}

function sortCmp(userA: any, userB: any): number {
  return userA.username.localeCompare(userB.username);
}

export default (context: any, inject: Function) => {
  const port: number = 3000;
  const loc: any = window.location;
  const socket: any = null;

  context.$axios.defaults.baseURL = loc.protocol + '//' + loc.hostname + ':' + port;
  const avatarBaseURL: string = `${context.$axios.defaults.baseURL}/api/user/avatar`;

  inject('user', {
    shortName,
    logout: logout(context),
    avatarBaseURL,
    socket,
    socketCreate: socketCreate(context),
    socketDelete: socketDelete(context),
    sortCmp,
  });
};

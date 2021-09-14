// Inject in Vue, context and store.
import https from 'https';

function shortName(username: string, max_length: number = 10): string {
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

function sortCmp(userA: any, userB: any): number {
  return userA.username.localeCompare(userB.username);
}

export default (context: any, inject: Function) => {
  const port: number = 3000;
  const loc: any = window.location;
  const socket: any = null;

  // https.globalAgent.options.rejectUnauthorized = false;
  // context.$axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  context.$axios.defaults.baseURL = loc.protocol + '//' + loc.hostname + ':' + port;
  const avatarBaseURL: string = `${context.$axios.defaults.baseURL}/api/user/avatar`;

  inject('user', {
    shortName,
    logout: logout(context),
    avatarBaseURL,
    socket,
    sortCmp,
  });
};

// Inject in Vue, context and store.

function shortName(username: string, max_length: number = 10): string {
  if (username.length <= max_length)
    return username;
  return username.substr(0, max_length - 3) + "...";
};

export default (context: any, inject: Function) => {
  const port: number = 3000;
  const loc: any = window.location;

  context.$axios.defaults.baseURL = loc.protocol + '//' + loc.hostname + ':' + port;
  const avatarBaseURL: string = `${context.$axios.defaults.baseURL}/api/user/avatar`;

  inject('user', {
    shortName,
    avatarBaseURL,
  });
};

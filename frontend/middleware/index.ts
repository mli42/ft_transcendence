export default async function (context: any) {
  if (context.store.state.isLogged == false)
    return ;
  const userResp: any = await context.app.$axios.get('/api/user/currentUser');
  const user = userResp.data;
  const avatarBaseURL: string = `${context.app.$axios.defaults.baseURL}/api/user/avatar`;
  const avatarURL: string = `${avatarBaseURL}/${user.userId}`;

  context.store.commit('updateUser', user);
  context.store.commit('updateAvatar', avatarURL);
  context.store.commit('updateAvatarBaseURL', avatarBaseURL);
};

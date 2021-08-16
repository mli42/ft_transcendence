export default async function (context: any) {
  if (context.store.state.isLogged == false)
    return ;
  const userResp: any = await context.app.$axios.get('/api/user/currentUser');
  const avatarResp: any = await context.app.$axios.get('/api/user/profile-picture');

  context.store.commit('updateUser', userResp.data);
  context.store.commit('updateAvatar', avatarResp.data);
};

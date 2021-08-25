import io from 'socket.io-client';

export default async function (context: any) {
  if (context.store.state.isLogged == false)
    return ;
  const userResp: any = await context.app.$axios.get('/api/user/currentUser');
  const user = userResp.data;
  const avatarBaseURL: string = context.$user.avatarBaseURL;
  const avatarURL: string = `${avatarBaseURL}/${user.profile_picture}`;

  if (context.store.state.socker === undefined)
    context.store.commit('updateSocket', io('ws://localhost:3000/', {withCredentials: true}));

  context.store.commit('updateUser', user);
  context.store.commit('updateAvatarURL', avatarURL);
};

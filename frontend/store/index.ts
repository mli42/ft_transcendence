export const state = () => ({
  user: {} as any,
  isLogged: false as boolean,
  avatarURL: '' as string,
  socket: undefined as any,
});

export type indexState = ReturnType<typeof state>;

export const mutations = {
  updateUser(state: indexState, user: any): void {
    state.user = user;
  },
  updateUserPartial(state: indexState, userPart: any): void {
    Object.assign(state.user, userPart);
  },
  updateLogState(state: indexState, isLogged: boolean): void {
    state.isLogged = isLogged;
  },
  updateAvatarURL(state: indexState, avatarURL: string): void {
    state.avatarURL = avatarURL;
  },
  updateAvatarName(state: indexState, avatarName: string): void {
    state.user.profile_picture = avatarName;
  },
  addFriend(state: indexState, userId: string): void {
    const index: number = state.user.friends.indexOf(userId);
    if (index == -1) {
      state.user.friends.push(userId);
    }
  },
  delFriend(state: indexState, userId: string): void {
    const index: number = state.user.friends.indexOf(userId);
    if (index > -1) {
      state.user.friends.splice(index, 1);
    }
  },
  update2FA(state: indexState, bool: boolean): void {
    state.user.twoFactorAuth = bool;
  },
  updateSocket(state: indexState, socket: any): void {
    state.socket = socket;
  },
  listenSocket(state: indexState, event: string, fct: Function): void{
    state.socket.on(event, fct);
  },
  emitSocket(state: indexState, event: string, objet: any): void{
    if (objet === undefined)
      state.socket.emit(event);
    else
      state.socket.emit(event, objet);
  },
};

export const actions = {
  updateAvatar(context: any, avatarName: string): void {
    const _this: any = this;
    const newAvatarURL: string = `${_this.$user.avatarBaseURL}/${avatarName}`;

    context.commit('updateAvatarName', avatarName);
    context.commit('updateAvatarURL', newAvatarURL);
  },
};

export const getters = {
};

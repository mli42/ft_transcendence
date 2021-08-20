export const state = () => ({
  user: {} as any,
  isLogged: false as boolean,
  avatarURL: '' as string,
});

export type indexState = ReturnType<typeof state>;

export const mutations = {
  updateUser(state: indexState, user: any): void {
    state.user = user;
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
};

export const actions = {
};

export const getters = {
};

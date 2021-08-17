export const state = () => ({
  user: {} as any,
  isLogged: false as boolean,
  avatarBaseURL: '' as string,
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
  updateAvatarBaseURL(state: indexState, avatarBaseURL: string): void {
    state.avatarBaseURL = avatarBaseURL;
  },
  updateAvatar(state: indexState, avatarURL: string): void {
    state.avatarURL = avatarURL;
  },
};

export const actions = {
};

export const getters = {
};

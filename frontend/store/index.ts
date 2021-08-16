export const state = () => ({
  user: {} as any,
  isLogged: false as boolean,
  avatar: undefined as any,
});

export type indexState = ReturnType<typeof state>;

export const mutations = {
  updateUser(state: indexState, user: any): void {
    state.user = user;
  },
  updateLogState(state: indexState, isLogged: boolean): void {
    state.isLogged = isLogged;
  },
  updateAvatar(state: indexState, avatar: any): void {
    state.avatar = avatar;
  },
};

export const actions = {
};

export const getters = {
};

export const state = () => ({
  user: {} as any,
});

export type indexState = ReturnType<typeof state>;

export const mutations = {
  updateUser(state: indexState, user: any): void {
    state.user = user;
  },
};

export const actions = {
};

export const getters = {
};

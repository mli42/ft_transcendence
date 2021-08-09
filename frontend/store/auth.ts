import loginInfos from '~/types/loginInfos';
import signUpInfos from '~/types/signUpInfos';

interface authApiInfos {
  path: string,
  body: unknown,
};

export const state = () => ({
  status: 'idle' as string,
  errorMsg: [] as string[],
  accessToken: '' as string,
});

export type authState = ReturnType<typeof state>;

export const mutations = {
  updateStatus(state: authState, status: string): void {
    state.status = status;
  },
  updateErrorMsg(state: authState, errorMsg: string | string[]): void {
    state.errorMsg = (typeof errorMsg == "string") ? [errorMsg] : errorMsg;
  },
  updateAccessToken(state: authState, accessToken: string): void {
    state.accessToken = accessToken;
  },
  deleteAccessToken(state: authState): void {
    state.accessToken = '';
  },
};

export const actions = {
  authSuccess(context: any, response: any): void {
    const _this: any = this;
    // context.commit('updateAccessToken', response.data.accessToken);
    _this.$router.push('/');
    _this.$axios.default.header.common['Authorization'] = "Bearer" + response.data.accessToken;
  },
  authFailed(context: any, error: any): void {
    context.commit('updateErrorMsg', error.response.data.message);
    setTimeout(() => context.commit('updateErrorMsg', []), 6000);
  },
  _auth(context: any, authInfos: authApiInfos): void {
    const _this: any = this;
    const opt: unknown = { withCredentials: true };

    context.commit('updateStatus', 'logging');
    _this.$axios.post(authInfos.path, authInfos.body, opt)
    .then((resp: any) => { context.dispatch('authSuccess', resp); })
    .catch((err: any) => { context.dispatch('authFailed', err); })
    .finally(() => { context.commit('updateStatus', 'idle'); } );
  },
  delog(context: any): void {
    const _this: any = this;
    context.commit('deleteAccessToken');
    _this.$router.push('/login');
  },
  login(context: any, logInfos: loginInfos) : void {
    const authInfos: authApiInfos = {
      path: '/api/user/signin',
      body: {
        id: logInfos.id,
        password: logInfos.password,
      },
    };
    context.dispatch('_auth', authInfos);
  },
  signUp(context: any, signInfos: signUpInfos) : void {
    const authInfos: authApiInfos = {
      path: '/api/user/signup',
      body: {
        username: signInfos.username,
        email: signInfos.email,
        password: signInfos.password,
        passwordConfirm: signInfos.password2,
      },
    };
    context.dispatch('_auth', authInfos);
  },
};

export const getters = {
  isConnected(state: authState): boolean {
    return (state.accessToken.length != 0);
  },
};

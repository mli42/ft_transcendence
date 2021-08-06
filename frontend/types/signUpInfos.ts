export interface IsignUpInfos {
  username: string,
  email: string,
  password: string,
  password2: string,
};

export default class signUpInfos implements IsignUpInfos {
  username = '';
  email = '';
  password = '';
  password2 = '';
};

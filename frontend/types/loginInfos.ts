export interface IloginInfos {
  id: string,
  password: string,
};

export default class loginInfos implements IloginInfos {
  id = '';
  password = '';
};

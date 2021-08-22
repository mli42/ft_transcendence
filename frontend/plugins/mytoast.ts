// Inject in Vue, context and store.

function getArrayMsg(messages: string | string[]): string[] {
  return (typeof messages == "string") ? [messages] : messages;
}

function errToast({ $toast }: any): Function {
  return function (messages: string | string[]): void {
    const errArr = getArrayMsg(messages);

    for (const errMsg of errArr) {
      $toast.global.errMsg({ message: errMsg });
    }
  };
}

const basicMsg: Function = (payload: any) => payload.message;

const dismissAct: Object = {
  text: 'OK',
  onClick: (e: any, toastObject: any) => {
    toastObject.goAway(0);
  },
};

const errOpt = {
  type: 'error',
  duration: 6000,
  action: [dismissAct],
  className: ['errToast'],
};

export default (context: any, inject: Function) => {
  context.$toast.register('errMsg', basicMsg, errOpt);

  inject('mytoast', {
    getArrayMsg,
    err: errToast(context),
  });
};

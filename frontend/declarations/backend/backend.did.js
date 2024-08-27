export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'convertTextToSpeech' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };

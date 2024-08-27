export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'convertTextToSpeech' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'healthCheck' : IDL.Func([], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };

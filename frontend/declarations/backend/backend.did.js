export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'convertTextToSpeech' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

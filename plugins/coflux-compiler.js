module.exports = function cofluxCompiler(babel) {
  const t = babel.types;
  // plugin contents
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name !== 'Provider') {
          return;
        }

        console.log(path.node.name);
      },

      ReturnStatement(path) {
        //console.log(path);
      }
    },
  };
};

const mapStateVisitor = require('./map-state-visitor');

module.exports = function cofluxCompiler(babel) {
  const t = babel.types;
  // plugin contents
  //console.log(t);
  return {
    visitor: {
      FunctionExpression(path) {
        const id = path.node.id;
        if (!id || id.name !== 'mapStateToProps') {
          return;
        }

        path.traverse(mapStateVisitor);
      },

      ReturnStatement(path) {
        //console.log(path);
      }
    },
  };
};

export const renderMethod = function(method) {
  if (method.arguments) {
    return new Function(...method.arguments.split(','), method.body);
  } else {
    return new Function(method.body);
  }
};

export const deconstructionMethodString = function(methodString) {
  if (!/^[a-zA-Z0-9]*(.*)$/.test(methodString)) {
    return {};
  }
  return {
    name: methodString.substring(0, methodString.indexOf('(')),
    arguments: eval(methodString.substring(methodString.indexOf('('), methodString.length))
  };
};

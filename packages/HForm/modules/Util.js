export const renderMethod = function(method) {
  if (method.arguments) {
    return new Function(...method.arguments.split(','), method.body);
  } else {
    return new Function(method.body);
  }
};

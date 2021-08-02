/**
 * @description: 解析方法字符串, 将其转换为方法配置对象
 * @param {string} methodString 方法字符串
 * @return {boolean|object} 解析失败为false, 成功为methodConfig对象
 */
function parseMethodString(methodString) {
  if (!/^[a-zA-Z0-9.]*(.*)$/.test(methodString)) {
    return false;
  }
  return {
    name: methodString.substring(0, methodString.indexOf('(')),
    arguments: eval(methodString.substring(methodString.indexOf('('), methodString.length))
  };
}

export { parseMethodString };
export default { parseMethodString };

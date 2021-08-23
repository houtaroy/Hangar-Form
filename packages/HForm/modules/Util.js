import postcss from 'postcss';
import postcssPrefixSelector from 'postcss-prefix-selector';

import { jsonMinimumVersion } from '../config';

const deconstructionMethodString = function(methodString) {
  if (!/^[a-zA-Z0-9.]*(.*)$/.test(methodString)) {
    return {};
  }
  return {
    name: methodString.substring(0, methodString.indexOf('(')),
    arguments: eval(methodString.substring(methodString.indexOf('('), methodString.length))
  };
};

/**
 * 检查Json版本是否支持
 * 即Json版本 >= 编辑器支持最低版本
 *
 * @param {String} version Json版本号
 * @returns {Boolean} 检查结果, true 支持 false 不支持
 */
const checkVersion = function(version) {
  if (version === jsonMinimumVersion) {
    return true;
  }
  let p1 = 0,
    p2 = 0;
  const n1 = version.length,
    n2 = jsonMinimumVersion.length;
  while (p1 < n1 || p2 < n2) {
    const temp1 = get_next_chunk(version, n1, p1);
    const temp2 = get_next_chunk(jsonMinimumVersion, n2, p2);
    if (temp1.num != temp2.num) {
      return temp1.num > temp2.num;
    }
    p1 = temp1.p;
    p2 = temp2.p;
  }
  return true;
};

const get_next_chunk = function(version, n, p) {
  if (p > n - 1) return { num: 0, p: p };
  let p_end = p;
  while (p_end < n && version[p_end] != '.') {
    p_end += 1;
  }
  const result = parseInt(p_end != n - 1 ? version.slice(p, p_end) : version.slice(p, n));
  p = p_end + 1;
  return {
    num: result,
    p: p
  };
};

/**
 * @description: 为所有css增加前缀选择器
 * @param {String} css css文本
 * @param {String} prefixSelector 前缀选择器名称
 * @return {*}
 */
const addCSSPrefixSelector = function(css, prefixSelector) {
  return postcss()
    .use(
      postcssPrefixSelector({
        prefix: `.${prefixSelector}`
      })
    )
    .process(css).css;
};

export { checkVersion, addCSSPrefixSelector, deconstructionMethodString };

export default {
  checkVersion,
  addCSSPrefixSelector,
  deconstructionMethodString
};

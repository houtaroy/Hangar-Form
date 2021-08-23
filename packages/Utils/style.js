import postcss from 'postcss';
import PostcssPrefixSelector from 'postcss-prefix-selector';

/**
 * @description: 为所有css增加前缀选择器
 * @param {String} css css文本
 * @param {String} prefixSelector 前缀选择器名称
 * @return {*}
 */
function addPrefixSelector(css, prefixSelector) {
  return postcss()
    .use(
      PostcssPrefixSelector({
        prefix: `.${prefixSelector}`
      })
    )
    .process(css).css;
}

export { addPrefixSelector };

export default {
  addPrefixSelector
};

import BaseParser from './models';
import DefaultMethodParser from './MethodParser';

const Parsers = {
  method: DefaultMethodParser
};

function getParsers() {
  return Object.assign({}, Parsers);
}

function getParser(name) {
  return Parsers[name];
}

function setParser(name, parser) {
  if (!(parser instanceof BaseParser)) {
    console.log('[Hangar-Form]: 解析器必须继承BaseParser');
  }
  Parsers[name] = parser;
}

export { BaseParser, getParsers, getParser, setParser };

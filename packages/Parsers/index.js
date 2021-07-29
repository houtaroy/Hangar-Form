import BaseParser from './models';
import DefaultMethodParser from './MethodParser';
import DefaultEventParser from './EventParser';
import DefaultComputedParser from './ComputedParser';
import DefaultWatchParser from './WatchParser';

const Parsers = {
  method: DefaultMethodParser,
  event: DefaultEventParser,
  methods: DefaultMethodParser,
  computed: DefaultComputedParser,
  watch: DefaultWatchParser,
  filter: DefaultMethodParser
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

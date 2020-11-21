const assert = require('assert');

var { create } = require('xmlbuilder2');

const BlockBase = require('./block');
const typed = require('./block_typed');
const blocks = require('./blocks');

class Writer {
  xmlroot = create({ version: '1.0' });
  root = new BlockBase('sb3');

  push(...block) {
    return this.root.push(...block);
  }

  /**
  * @return {string}
  */
  export() {
    this.root.build(this.xmlroot);
    return this.xmlroot.end({ prettyPrint: true });
  }
}

module.exports = Writer;

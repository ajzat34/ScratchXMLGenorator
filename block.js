var { create } = require('xmlbuilder2');
const assert = require('assert');

class BlockBase extends Array {
  opcode;
  attr;

  /**
  * @constructor
  * @param {string} opcode
  */
  constructor(opcode = 'null', attr = {}) {
    super();
    this.opcode = opcode;
    this.attr = attr;
    this.closed = false;
  }

  /**
  * @param {}
  */
  build(on) {
    const el = on.ele(this.opcode, this.attr);
    for (const child of this) {
      child.build(el);
    };
  }

  push(...blocks) {
    for (const block of blocks) {
      assert(block instanceof BlockBase || block instanceof BlockBase.Text);
      if (block instanceof BlockBase)
        assert.strictEqual(this.closed, false, `Attempt to write block: ${block.opcode} to capped stack`);
      this.closed = !!this.closed || !!block.cap;
    }
    return super.push(...blocks);
  }

  static Text = class {
    constructor(text) {
      this.text = text;
    }

    /**
    * @param {}
    */
    build(on) {
      on.txt(this.text);
    }
  }

  static text = function(text){return new BlockBase.Text(text)};
}

module.exports = BlockBase;

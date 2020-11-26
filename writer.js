const assert = require('assert');

var { create } = require('xmlbuilder2');

const BlockBase = require('./block');
const typed = require('./block_typed');
const blocks = require('./blocks');

class Writer {
  root = new BlockBase('sb3');
  #procedures = new typed.BlockProceduresSection();
  #variables = new typed.BlockVariableDefSection();
  #assets = new typed.BlockAssetSection();
  #blocks = new typed.BlockBlocksSection();

  constructor() {
    this.root.push(this.#variables);
    this.root.push(this.#assets);
    this.root.push(this.#procedures);
    this.root.push(this.#blocks);
  }

  #_push(block) {
    if (block instanceof typed.BlockVariableDef)
      return this.#variables.push(block);
    if (block instanceof typed.BlockAsset)
      return this.#assets.push(block);
    if (block instanceof typed.BlockProcedure)
      return this.#procedures.push(block);
    else
      return this.#blocks.push(block);
  }

  push(...blocks) {
    for (const block of blocks) this.#_push(block);
  }

  /**
  * @return {string}
  */
  export() {
    const root = create({ version: '1.0' });
    this.root.build(root);
    return root.end({ prettyPrint: true });
  }
}

module.exports = Writer;

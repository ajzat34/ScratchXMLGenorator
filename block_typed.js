const assert = require('assert');

const BlockBase = require('./block');

// ----- Basic Scratch Block Types
class BlockHat extends BlockBase {};
class BlockStack extends BlockBase {};
class BlockReporter extends BlockBase {};
  class BlockBoolean extends BlockReporter {};
  class BlockLiteral extends BlockReporter {};
class BlockC extends BlockStack {};
class BlockCap extends BlockStack {
  cap = true;
};

// ----- Helper for branches
class _BlockBranch extends BlockBase {
  #_push(block) {
    assert(block instanceof BlockStack, `Block: ${block.opcode} is not stackable`);
    return super.push(block);
  }
  push(...blocks) {
    for (const block of blocks) {
      this.#_push(block);
    }
  }
}

// ----- Basic Branch
class BlockBranch extends _BlockBranch {
  constructor(){super('branch')}
};

// ----- <variables> section
class BlockVariableDef extends BlockBase {};
  // <var symbol="symbol"/> in <variables> section
  class BlockVarDef extends BlockVariableDef {
    constructor(symbol) {
      assert(typeof symbol === 'string');
      super('var', {symbol});
    }
  };
  // <list symbol="symbol"/> in <variables> section
  class BlockListDef extends BlockVariableDef {
    constructor(symbol) {
      assert(typeof symbol === 'string');
      super('list', {symbol});
    }
  };

class BlockVariableDefSection extends BlockBase {
  constructor(){super('variables')}
  push(block) {
    assert(block instanceof BlockVariableDef);
    return super.push(block);
  }
};

  // ----- <assets> section
class BlockAsset extends BlockBase {
  constructor(symbol) {
    assert(typeof symbol === 'string');
    super('asset', {symbol});
  }
};

// ----- <procedures> section
class BlockProcedure extends _BlockBranch {
  constructor(symbol, warp = false) {
    assert(typeof symbol === 'string');
    super('proc', {symbol, warp});
  }
};

class BlockProceduresSection extends BlockBase {
  constructor(){super('procedures')}
  push(block) {
    assert(block instanceof BlockProcedure);
    return super.push(block);
  }
};

class BlockAssetSection extends BlockBase {
  constructor(){super('assets')}
  push(block) {
    assert(block instanceof BlockAsset);
    return super.push(block);
  }
};

// ------ <blocks section>
class BlockBlocksSection extends _BlockBranch {
  constructor(){super('blocks')}
};

module.exports = {
  BlockLiteral,
  BlockHat,
  BlockStack,
  BlockReporter,
  BlockBoolean,
  BlockC,
  BlockCap,

  BlockBranch,

  BlockVariableDef,
  BlockVarDef,
  BlockListDef,
  BlockAsset,
  BlockProcedure,

  BlockVariableDefSection,
  BlockAssetSection,
  BlockProceduresSection,
  BlockBlocksSection,

  assertReporter(block) {
    assert(typeof block === 'object', `${block} is not an object`);
    assert(block instanceof BlockReporter, `${block.opcode} is not a reporter`);
  },

  assertBloolean(block) {
    assert(typeof block === 'object', `${block} is not an object`);
    assert(block instanceof BlockBoolean, `${block.opcode} is not a boolean`);
  },

  assertBranch(block) {
    assert(typeof block === 'object', `${block} is not an object`);
    assert(block instanceof BlockBranch, `${block.opcode} is not a branch`);
  },
}

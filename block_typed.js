const assert = require('assert');

const BlockBase = require('./block');

class BlockHat extends BlockBase {};
class BlockStack extends BlockBase {};
class BlockReporter extends BlockBase {};
  class BlockBoolean extends BlockReporter {};
  class BlockLiteral extends BlockReporter {};
class BlockC extends BlockStack {};
class BlockCap extends BlockStack {
  cap = true;
};

class BlockBranch extends BlockBase {
  constructor(){super('branch')}
  push(block) {
    assert(block instanceof BlockStack);
    return super.push(block);
  }
};

class BlockVariableDef extends BlockBase {};
class BlockAsset extends BlockBase {};
class BlockProcedure extends BlockBase {
  push(block) {
    assert(block instanceof BlockStack);
    return super.push(block);
  }
};

class BlockSection extends BlockBase {};
  class BlockVariableDefSection extends BlockSection {
    push(block) {
      assert(block instanceof BlockVariableDef);
      return super.push(block);
    }
  };

  class BlockAssetSection extends BlockSection {
    push(block) {
      assert(block instanceof BlockAsset);
      return super.push(block);
    }
  };

  class BlockProceduresSection extends BlockSection {
    push(block) {
      assert(block instanceof BlockProcedure);
      return super.push(block);
    }
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
  BlockAsset,
  BlockProcedure,

  BlockVariableDefSection,
  BlockAssetSection,
  BlockProceduresSection,

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

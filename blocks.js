const assert = require('assert');
const BlockBase = require('./block');
const txt = BlockBase.text;
const typed = require('./block_typed');

/*
exports functions:

// motion
goto
gotox
gotoy
x
y
direction
setangle

// looks
say
think
setcostume
costume
setsize
show
hide

// control
sleep
repeat
forever
if
ifelse
sleepuntil
until

// sensing
ask
answer
keypressed
mousedown
mousex
mousey
resettimer

// operator
add
sub
mul
div
mod
gt
lt
eq
and
or
not
strjoin
strindex
strlength
strcontains
random
op

// data
set
incr
varshow
varhide
listpush
listremove
listclear
listinsert
listreplace
listindex
listfindindex
listcontains
listshow
listhide
listlength

// pen
clear
stamp
pendown
penup
setpensize
setpencolor

// special
stopall
stopthis

// other
number
string
symbol
call
branch
procedure
blockasset
definevar
definelist

// other
// these are for creating blocks that havent been implimented
stack
reporter
boolean
c
cap
*/

function factory(base, opcode, names = []) {
  if (typeof names === 'string') names = [names];
  return class extends base {
    constructor(...reporters) {
      super(opcode);
      // loop over args
      assert.strictEqual(names.length, reporters.length, `Need exactly ${names.length} arguments for ${opcode}`);
      for (const i in names) {
        // get the block and name
        const reporter = reporters[i];
        const name = names[i];
        // assert a reporter
        typed.assertReporter(reporter);
        // push the arguments
        if (name.length)
          this.push(txt(`${name}:`), reporter);
        else
          this.push(reporter);
      }
    }
  }
}

class NumberBlock extends typed.BlockLiteral {
  constructor(value) {
    assert(typeof value === 'number');
    super('n', {value: value.toString()});
  }
}

class StringBlock extends typed.BlockLiteral {
  constructor(value) {
    assert(typeof value === 'string');
    super('s', {value});
  }
}

class If extends typed.BlockC {
  constructor(condition, branch) {
    super('if');
    typed.assertBloolean(condition);
    typed.assertBranch(branch);
    this.push(txt('condition:'), condition);
    this.push(txt('branch:'), branch);
  }
}

class IfElse extends typed.BlockC {
  constructor(condition, branch, branch_else) {
    super('ifelse');
    typed.assertBloolean(condition);
    typed.assertBranch(branch);
    typed.assertBranch(branch_else);
    this.push(txt('condition:'), condition);
    this.push(txt('true branch:'), branch);
    this.push(txt('false branch:'), branch_else);
  }
}

class Repeat extends typed.BlockC {
  constructor(times, branch) {
    super('repeat');
    typed.assertReporter(times);
    typed.assertBranch(branch);
    this.push(txt('times:'), times);
    this.push(txt('branch:'), branch);
  }
}

class Until extends typed.BlockC {
  constructor(condition, branch) {
    super('until');
    typed.assertBloolean(condition);
    typed.assertBranch(branch);
    this.push(txt('condition:'), condition);
    this.push(txt('branch:'), branch);
  }
}

class Forever extends typed.BlockC {
  constructor(branch) {
    super('forever');
    typed.assertBranch(branch);
    this.push(branch);
  }
}

class Symbol extends typed.BlockReporter {
  constructor(symbol) {
    assert(typeof symbol === 'string');
    super('symbol', {symbol});
  }
}

class Call extends typed.BlockStack {
  constructor(symbol) {
    assert(typeof symbol === 'string');
    super('call', {symbol});
  }
}

class Op extends typed.BlockReporter {
  constructor(op) {
    assert(typeof op === 'string');
    super('op', {op});
  }
}

const blocks = {
  // motion
  Goto: factory(typed.BlockStack, 'goto', ['x','y']),
  GotoX: factory(typed.BlockStack,'gotox', ['x']),
  GotoY: factory(typed.BlockStack,'gotoy', ['y']),
  X: factory(typed.BlockReporter, 'x'),
  Y: factory(typed.BlockReporter, 'y'),
  Direction: factory(typed.BlockReporter, 'direction'),
  SetAngle: factory(typed.BlockStack, 'set-angle', 'value'),

  // looks
  Say: factory(typed.BlockStack, 'say', 'text'),
  Think: factory(typed.BlockStack, 'think', 'text'),
  SetCostume: factory(typed.BlockStack, 'set-costume', 'costume'),
  Costume: factory(typed.BlockReporter, 'costume'),
  SetSize: factory(typed.BlockStack, 'set-size', 'size'),
  Show: factory(typed.BlockStack, 'show'),
  Hide: factory(typed.BlockStack, 'hide'),

  // control
  Sleep: factory(typed.BlockStack, 'sleep'),
  Repeat: Repeat,
  Forever: Forever,
  If: If,
  IfElse: IfElse,
  SleepUntil: factory(typed.BlockStack, 'sleep-until'),
  Until: Until,

  // sensing
  Ask: factory(typed.BlockStack, 'ask', 'question'),
  Answer: factory(typed.BlockReporter, 'answer'),
  KeyPressed: factory(typed.BlockBoolean, 'keypressed', 'key_option'),
  // keyoptions: 'sensing.keyoptions',
  MouseDown: factory(typed.BlockBoolean, 'mousedown'),
  MouseX: factory(typed.BlockReporter, 'mousex'),
  MouseY: factory(typed.BlockReporter, 'mousey'),
  ResetTimer: factory(typed.BlockStack, 'reset-timer'),

  // operator
  Add: factory(typed.BlockReporter, 'add', ['op1', 'op2']),
  Sub: factory(typed.BlockReporter, 'sub', ['op1', 'op2']),
  Mul: factory(typed.BlockReporter, 'mul', ['op1', 'op2']),
  Div: factory(typed.BlockReporter, 'div', ['op1', 'op2']),
  Mod: factory(typed.BlockReporter, 'mod', ['op1', 'op2']),

  Gt: factory(typed.BlockBoolean, 'gt', ['operand1', 'operand2']),
  Lt: factory(typed.BlockBoolean, 'lt', ['operand1', 'operand2']),
  Eq: factory(typed.BlockBoolean, 'eq', ['operand1', 'operand2']),
  And: factory(typed.BlockBoolean, 'and', ['operand1', 'operand2']),
  Or: factory(typed.BlockBoolean, 'or', ['operand1', 'operand2']),
  Not: factory(typed.BlockBoolean, 'not', 'operand'),

  StrJoin: factory(typed.BlockReporter, 'str-join', ['string1','string2']),
  StrIndex: factory(typed.BlockReporter, 'str-index', ['index','string']),
  StrLength: factory(typed.BlockReporter, 'str-length', 'string'),
  StrContains: factory(typed.BlockBoolean, 'str-contains', 'string'),

  Random: factory(typed.BlockReporter, 'random', ['low', 'high']),
  op: Op,

  // data
  Set: factory(typed.BlockStack, 'set', ['variable','value']),
  Incr: factory(typed.BlockStack, 'incr', ['variable','amount']),
  VarShow: factory(typed.BlockStack, 'var-show', 'variable'),
  VarHide: factory(typed.BlockStack, 'var-hide', 'variable'),
  ListPush: factory(typed.BlockStack, 'list-push', 'list', 'item'),
  ListRemove: factory(typed.BlockStack, 'list-remove', 'list', 'index'),
  ListClear: factory(typed.BlockStack, 'list-clear', 'list'),
  ListInsert: factory(typed.BlockStack, 'list-insert', 'list', 'index', 'item'),
  ListReplace: factory(typed.BlockStack, 'list-replace', 'list', 'index', 'item'),
  ListIndex: factory(typed.BlockReporter, 'list-index', ['list', 'index']),
  ListFindIndex: factory(typed.BlockReporter, 'list-find-index', ['list', 'item']),
  ListContains: factory(typed.BlockBoolean, 'list-contains', ['list', 'item']),
  ListShow: factory(typed.BlockStack, 'list-show', 'list'),
  ListHide: factory(typed.BlockStack, 'list-hide', 'list'),
  ListLength: factory(typed.BlockReporter, 'list-length', 'list'),

  // pen
  Clear: factory(typed.BlockStack, 'clear'),
  Stamp: factory(typed.BlockStack, 'stamp'),
  PenDown: factory(typed.BlockStack, 'pen-down'),
  PenUp: factory(typed.BlockStack, 'pen-up'),
  SetPenSize: factory(typed.BlockStack, 'set-pen-size', 'size'),
  SetPenColor: factory(typed.BlockStack, 'set-pen-color', 'color'),

  // special
  StopAll: factory(typed.BlockCap, 'stop-all'),
  StopThis: factory(typed.BlockCap, 'stop-this'),

  // internal
  Number: NumberBlock,
  String: StringBlock,
  Symbol: Symbol,
  Call: Call,

  Branch: typed.BlockBranch,

  Procedure: typed.BlockProcedure,

  BlockAsset: typed.BlockAsset,

  DefineVar: typed.BlockVarDef,
  DefineList: typed.BlockListDef,

  Stack: typed.BlockStack,
  Reporter: typed.BlockReporter,
  Boolean: typed.BlockBoolean,
  C: typed.BlockC,
  Cap: typed.BlockCap,
}


// define module.exports to reflect the list of classes above
// but convert the keys to lower case and return wrapper functions
// for creating new instances
for (const key of Object.keys(blocks)) {
  module.exports[key.toLowerCase()] = (...args)=>new blocks[key](...args);
}

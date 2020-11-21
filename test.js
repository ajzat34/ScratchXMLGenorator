const {Writer, blocks} = require('./index.js');

const w = new Writer();
const branch = blocks.branch();
branch.push(
  blocks.say(blocks.string('hi'))
);
const proc = blocks.procedure('test', true);
w.push(proc);
proc.push(
  blocks.goto(
    blocks.number(1),
    blocks.number(5),
  ),
  blocks.if(
    blocks.eq(
      blocks.number(1),
      blocks.number(1),
    ),
    branch,
  ),
);

console.log(w.export())

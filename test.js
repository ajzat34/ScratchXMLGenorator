const {Writer, blocks} = require('./index.js');

const w = new Writer();
w.push(blocks.definelist('list'));
const branch = blocks.branch();
branch.push(
  blocks.say(blocks.string('entered if statement'))
);
const proc = blocks.procedure('main', true);
w.push(proc, blocks.call('main'));
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
  )
);

console.log(w.export())

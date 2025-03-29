const { transferOwnership, withdrawTokens, getTokenBalance, getOwner } = require('./caller.js'); //import modules exported from caller.js

async function main() {
  // Test read-only functions first
  await getOwner();
  await getTokenBalance();
  await withdrawTokens( "0x000000000000000000000000000000000000dead", "1000000000000000000000");

}

main().catch(console.error);

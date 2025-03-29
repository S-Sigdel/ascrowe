const { 
  transferOwnership,
  withdrawTokens,
  depositTokens,
  recoverERC721,
  renounceOwnership,
  getTokenBalance,
  getOwner,
  hasNFT,
  getNFTAddress
} = require('./caller.js');

async function main() {
  try {
    // 1. Get initial state
    console.log("\n=== Initial State ===");
    const initialOwner = await getOwner();
    const initialBalance = await getTokenBalance();
    const nftAddress = await getNFTAddress();
    
    // 2. Test deposit (requires token approval first)
    //console.log("\n=== Testing Deposit ===");
    //await depositTokens("1000000000000000000"); // 1 token (18 decimals)
    //await getTokenBalance();

    // 3. Test withdrawal
    //console.log("\n=== Testing Withdrawal ===");
    //const deadAddress = "0x000000000000000000000000000000000000dEaD";
    //await withdrawTokens(deadAddress, "500000000000000000"); // 0.5 token
    //await getTokenBalance();

    // 4. Test ownership transfer
    console.log("\n=== Testing Ownership ===");
    //const newOwner = "0xYourNewOwnerAddressHere"; // Replace with actual address
    //await transferOwnership(newOwner);
    await getOwner();

    // 5. Test NFT recovery (requires NFT ownership)
    //console.log("\n=== Testing NFT Recovery ===");
    //await recoverERC721(nftAddress, 1); // Replace with actual token ID
    //console.log("NFT recovery initiated");

    // 6. Test view functions
    console.log("\n=== Testing View Functions ===");
    await hasNFT(initialOwner);
    await getNFTAddress();

    // 7. Test ownership renunciation (careful!)
    // console.log("\n=== Testing Renounce Ownership ===");
    // await renounceOwnership();
    // await getOwner();

  } catch (error) {
    console.error("Error in main execution:", error);
  }
}

// Execute with cleanup
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

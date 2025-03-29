require("dotenv").config();
const { Web3 } = require("web3");

const web3 = new Web3("https://sepolia.infura.io/v3/c95289ab5d0f4ecd8eda1a8dadd607fb");
const contractAddress = "0x34Bea57E63292729B0Df44F068349a36485ecA88"
const privateKey = process.env.PRIVATE_KEY;

const contractABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "depositTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "initialOwner", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "nftAddress", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "recoverERC721",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "depositor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "TokensDeposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "TokensWithdrawn",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "withdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTokenBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "hasNFT",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "NFT_ADDRESS",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nftContract",
    "outputs": [{ "internalType": "contract IERC165", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TOKEN_ADDRESS",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function sendTransaction(functionCall) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const tx = {
    from: account.address,
    to: contractAddress,
    data: functionCall,
    gas: 200000,
    chainId: 11155111, // Sepolia
    nonce: await web3.eth.getTransactionCount(account.address, "pending"),
    gasPrice: await web3.eth.getGasPrice()
  };

  const signedTx = await account.signTransaction(tx);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("Transaction Hash:", receipt.transactionHash);
}

// Existing functions
async function transferOwnership(newOwner) {
  const functionCall = contract.methods.transferOwnership(newOwner).encodeABI();
  await sendTransaction(functionCall);
}

async function withdrawTokens(recipient, amount) {
  const functionCall = contract.methods.withdrawTokens(recipient, amount).encodeABI();
  await sendTransaction(functionCall);
}

// New functions
async function depositTokens(amount) {
  const functionCall = contract.methods.depositTokens(amount).encodeABI();
  await sendTransaction(functionCall);
}

async function recoverERC721(nftAddress, tokenId) {
  const functionCall = contract.methods.recoverERC721(nftAddress, tokenId).encodeABI();
  await sendTransaction(functionCall);
}

async function renounceOwnership() {
  const functionCall = contract.methods.renounceOwnership().encodeABI();
  await sendTransaction(functionCall);
}

// View functions
async function getTokenBalance() {
  const balance = await contract.methods.getTokenBalance().call();
  console.log("Token Balance:", balance);
  return balance;
}

async function getOwner() {
  const owner = await contract.methods.owner().call();
  console.log("Owner:", owner);
  return owner;
}

async function hasNFT(user) {
  const result = await contract.methods.hasNFT(user).call();
  console.log("Has NFT:", result);
  return result;
}

async function getNFTAddress() {
  const address = await contract.methods.NFT_ADDRESS().call();
  console.log("NFT Address:", address);
  return address;
}

module.exports = {
  transferOwnership,
  withdrawTokens,
  depositTokens,
  recoverERC721,
  renounceOwnership,
  getTokenBalance,
  getOwner,
  hasNFT,
  getNFTAddress
};

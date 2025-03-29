require("dotenv").config();
const { Web3 } = require("web3"); // Destructure Web3 from the package

const web3 = new Web3("https://sepolia.infura.io/v3/c95289ab5d0f4ecd8eda1a8dadd607fb"); // Replace with your Infura or other RPC URL
const contractAddress = "0x4b44BaEe14EeA7FdEd51A1FB90D65E1FEC696751"; // Replace with actual contract address
const privateKey = process.env.PRIVATE_KEY;

const contractABI = [
  { inputs: [{ internalType: "address", name: "initialOwner", type: "address" }], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [{ internalType: "address", name: "newOwner", type: "address" }], name: "transferOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "withdrawTokens", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [], name: "getTokenBalance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "token", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "TOKEN_ADDRESS", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function sendTransaction(functionCall) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const tx = {
    to: contractAddress,
    gas: 200000,
    data: functionCall,
  };
  const signedTx = await account.signTransaction(tx);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("Transaction Hash:", receipt.transactionHash);
}

async function transferOwnership(newOwner) {
  const functionCall = contract.methods.transferOwnership(newOwner).encodeABI();
  await sendTransaction(functionCall);
}

async function withdrawTokens(recipient, amount) {
  const functionCall = contract.methods.withdrawTokens(recipient, amount).encodeABI();
  await sendTransaction(functionCall);
}

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

module.exports = { transferOwnership, withdrawTokens, getTokenBalance, getOwner };

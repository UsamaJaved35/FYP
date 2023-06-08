// Used to connect to the blockchain and interact with the smart contract
const ethers = require('ethers');
require('dotenv').config();
const API_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const { abi } = require("./artifacts/contracts/HashStorage.sol/HashStorage.json");
const contractInstance = new ethers.Contract(contractAddress, abi, signer);

module.exports = {
  provider,
  contractInstance
};

// Axelar chains config
// https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/testnet.json
// Deploy Custom Token
// Use this command to run this file: npx hardhat run scripts/deployCustomInterchainToken.js --network mumbai

const hre = require("hardhat");
const crypto = require("crypto");

const interchainTokenServiceContractABI = require("../utils/its/interchainTokenServiceABI");
const interchainTokenFactoryContractABI = require("../utils/its/interchainTokenFactoryABI");
const tokenManagerContractABI = require("../utils/its/tokenManagerABI");
const customTokenContractABI = require("../utils/token/customTokenABI");

const MESSAGE_TYPE_INTERCHAIN_TRANSFER = 0;
const MESSAGE_TYPE_DEPLOY_INTERCHAIN_TOKEN = 1;
const MESSAGE_TYPE_DEPLOY_TOKEN_MANAGER = 2;

const MINT_BURN = 0;
const LOCK_UNLOCK = 2;

// Addresses on mainnet/testnet
const interchainTokenServiceContractAddress =
  "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";
const interchainTokenFactoryContractAddress =
  "0x83a93500d23Fbc3e82B410aD07A6a9F7A0670D66";
const tokenManagerAddress = "0xC1B09c9c16117417A1B414A52Dd92CF1f634e786";
const customTokenAddress = "0x4a7313351ea46F8bbca56375AD7D2464727DfeA4";

// Initialize salt
const salt = "0x" + crypto.randomBytes(32).toString("hex");

// deploy TM on local chain
async function deployLocalTokenManager() {}

// Deploy TM to remote chain
async function deployRemoteTokenManager() {}

// Transfer tokens
async function transferTokens() {}

// Uncomment the function you want to run below before deploying

async function run() {
  try {
    // await deployLocalTokenManager();
    // await deployRemoteTokenManager();
    // await transferTokens();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

run();

// Axelar chains config
// https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/testnet.json
// Deploy Canonical Token
// Use this command to run this file: npx hardhat run scripts/deployCanonicalInterchainToken.js --network mumbai

const hre = require("hardhat");
const crypto = require("crypto");

const interchainTokenServiceContractABI = require("../utils/its/interchainTokenServiceABI");
const interchainTokenFactoryContractABI = require("../utils/its/interchainTokenFactoryABI");
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
const customTokenAddress = "0xF7952f5fCE0F8744aC97B3415236Ed463118D2fd"; // Polygon: GFToken

// registerCanonicalInterchainToken : Polygon
async function registerCanonicalInterchainToken() {
  const [owner] = await ethers.getSigners();

  const interchainTokenFactoryContract = new ethers.Contract(
    interchainTokenFactoryContractAddress,
    interchainTokenFactoryContractABI,
    owner
  );

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  console.log("owner.address: ", owner.address);

  const txn =
    await interchainTokenFactoryContract.registerCanonicalInterchainToken(
      customTokenAddress
    );

  console.log("txn: ", txn);

  const tokenId =
    await interchainTokenFactoryContract.canonicalInterchainTokenId(
      customTokenAddress
    );

  console.log("tokenId: ", tokenId);

  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log("expectedTokenManagerAddress: ", expectedTokenManagerAddress);

  // owner.address:  0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C
  // txn_hash: '0x9fedfe1e6309db4a22a1930e9aa34a86f28dda4253573062d4193d92b7a0f30e',
  // tokenId:  0x66a22b3aa9e944b14a426f5d5362fa285be898f487323b5bd6c28677790747de
  // expectedTokenManagerAddress:  0xd608C9b5aE8F6eebbB3774011164000cbC063052
}

// deployRemoteCanonicalInterchainToken: On Avalanche
async function deployRemoteCanonicalInterchainToken() {
  const [owner] = await ethers.getSigners();

  const interchainTokenFactoryContract = new ethers.Contract(
    interchainTokenFactoryContractAddress,
    interchainTokenFactoryContractABI,
    owner
  );

  const txn =
    await interchainTokenFactoryContract.deployRemoteCanonicalInterchainToken(
      "Polygon",
      customTokenAddress,
      "Avalanche",
      ethers.utils.parseEther("0.01"),
      { value: ethers.utils.parseEther("0.02"), gasLimit: 3000000 }
    );

  console.log("txn: ", txn);

  // txn: 0x7d722b5db5726da031b31b1ae154da92c4653c6e8640441501691f2abb45be40
  // https://mumbai.polygonscan.com/tx/0x7d722b5db5726da031b31b1ae154da92c4653c6e8640441501691f2abb45be40
  // On Axelar:  https://testnet.axelarscan.io/gmp/0x7d722b5db5726da031b31b1ae154da92c4653c6e8640441501691f2abb45be40
}

// Transfer tokens : Polygon -> Avalanche
async function transferTokens() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  // Approve ITS to spend tokens
  const customTokenContract = new ethers.Contract(
    customTokenAddress,
    customTokenContractABI,
    owner
  );

  const approve = await customTokenContract.approve(
    interchainTokenServiceContractAddress,
    ethers.utils.parseEther("50")
  );

  console.log("approve: ", approve);

  const transfer = await interchainTokenServiceContract.interchainTransfer(
    "0x66a22b3aa9e944b14a426f5d5362fa285be898f487323b5bd6c28677790747de",
    "Avalanche",
    "0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C",
    ethers.utils.parseEther("50"),
    "0x",
    ethers.utils.parseEther("0.2"),
    {
      // Transaction options should be passed here as an object
      value: ethers.utils.parseEther("0.2"), // Sending ether as the transaction value
      gasLimit: 3000000, // Specifying the gas limit
    }
  );

  console.log("transfer: ", transfer);

  // Approve txn: 0x7dc1ffd42d8c80e1e5ec586a54da5d3f9dc4b450f8ca6687c32733ea09369cb5
  // Transfer txn: 0x47e9b9868c8f073afc92b7b99acdf07f2c937b7297c6897a97c5c5af3b1c1592
  // https://testnet.axelarscan.io/gmp/0x47e9b9868c8f073afc92b7b99acdf07f2c937b7297c6897a97c5c5af3b1c1592
}

// Uncomment the function you want to run below before deploying
async function run() {
  try {
    //     await registerCanonicalInterchainToken();
    //     await deployRemoteCanonicalInterchainToken();
    // await transferTokens();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

run();

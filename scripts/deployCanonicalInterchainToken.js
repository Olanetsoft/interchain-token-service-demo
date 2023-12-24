// Axelar chains config
// https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/testnet.json
// Deploy Canonical Token
// Use this command to run this file: npx hardhat run scripts/deployCanonicalInterchainToken.js --network mumbai

const hre = require("hardhat");
const crypto = require("crypto");

const interchainTokenServiceContractABI = require("../utils/its/interchainTokenServiceABI");
const interchainTokenFactoryContractABI = require("../utils/its/interchainTokenFactoryABI");

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
const customTokenAddress = "0x4a7313351ea46F8bbca56375AD7D2464727DfeA4";

// registerCanonicalInterchainToken
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

  const tokenId =
    await interchainTokenFactoryContract.canonicalInterchainTokenId(
      customTokenAddress
    );

  console.log("tokenId: ", tokenId);

  let txn =
    await interchainTokenFactoryContract.registerCanonicalInterchainToken(
      customTokenAddress
    );

  console.log("txn: ", txn);

  // Use this payload to listen to different event during deployment

  //   const params = ethers.utils.defaultAbiCoder.encode(
  //     ["bytes", "address"],
  //     [owner.address, customTokenAddress]
  //   );

  //   const payload = ethers.utils.defaultAbiCoder.encode(
  //     ["uint256", "bytes32", "string", "string", "uint8", "bytes"],
  //     [
  //       MESSAGE_TYPE_DEPLOY_INTERCHAIN_TOKEN,
  //       tokenId,
  //       "TCToken20",
  //       "TCT20",
  //       18,
  //       owner.address,
  //     ]
  //   );

  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log("expectedTokenManagerAddress: ", expectedTokenManagerAddress);

  //   owner.address:  0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C
  //   tokenId:  0xfc483c4930285c8605fee66a31a5045bf29a7b9ecf2aefa4cea44ea4b74bf395
  //   txn_hash: '0xdb6db9755a9c6447b99e0807a270b49fbabbc95ca809e4d0143549d08c04b216'
  //   expectedTokenManagerAddress:  0xa9a23B6388F36CBB15d1bDB4B710E39394B680e5
}

// deployRemoteCanonicalInterchainToken
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
      "Fantom",
      ethers.utils.parseEther("0.01"),

      { value: ethers.utils.parseEther("0.01"), gasLimit: 3000000 }
    );

  console.log("txn: ", txn);

  // txn: 0xfdd59faa45020ea1f2d816959c86fa9ea8d1fdbec04513e6a691ddeda72efcbc
}

// Transfer tokens
async function transferTokens() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  const transfer = await interchainTokenServiceContract.interchainTransfer(
    "0xfc483c4930285c8605fee66a31a5045bf29a7b9ecf2aefa4cea44ea4b74bf395",
    "Fantom",
    "0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C",
    ethers.utils.parseEther("50"),
    "0x",
    { value: ethers.utils.parseEther("0.1"), gasLimit: 3000000 }
  );

  console.log("transfer: ", transfer);

  //txn: 0xc34b402d84bdc32dd3884aca1868f53bd5fc87d98a9931ea682a8b54d693d980
}

// Uncomment the function you want to run below before deploying
async function run() {
  try {
    // await registerCanonicalInterchainToken();
    // await deployRemoteCanonicalInterchainToken();
    await transferTokens();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

run();

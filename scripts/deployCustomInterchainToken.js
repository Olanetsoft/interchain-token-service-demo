// Axelar chains config
// https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/testnet.json
// Deploy Custom Token
// Use this command to run this file:
// For Sepolia: npx hardhat run scripts/deployCustomInterchainToken.js --network sepolia
// For Binance: npx hardhat run scripts/deployCustomInterchainToken.js --network bsc

const hre = require("hardhat");
const crypto = require("crypto");

const interchainTokenServiceContractABI = require("../utils/its/interchainTokenServiceABI");
const interchainTokenFactoryContractABI = require("../utils/its/interchainTokenFactoryABI");
const tokenManagerContractABI = require("../utils/its/tokenManagerABI");
const TestMintableBurnableERC20ContractABI = require("../utils/token/TestMintableBurnableERC20ABI");

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

const sepoliaCustomTokenAddress = "0x4E703bd524eaA03F3685026a2428e3fDF258Da37";
const binanceCustomTokenAddress = "0x7eBF876f04064A88ba67F4ba60E6eCE0BCCBc88E";

// Initialize salt
const salt = "0x" + crypto.randomBytes(32).toString("hex");

// deploy TM on local chain : Sepoli
async function deployLocalTokenManager() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  const tokenManagerContract = new ethers.Contract(
    tokenManagerAddress,
    tokenManagerContractABI,
    owner
  );

  console.log("owner.address: ", owner.address);
  console.log("salt: ", salt);

  const params = await tokenManagerContract.params(
    owner.address,
    sepoliaCustomTokenAddress
  );

  console.log("params: ", params);

  const txn = await interchainTokenServiceContract.deployTokenManager(
    salt,
    "",
    MINT_BURN,
    params,
    ethers.utils.parseEther("0.01")
  );

  console.log("txn: ", txn);

  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    owner.address,
    salt
  );

  console.log("tokenId: ", tokenId);

  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log("expectedTokenManagerAddress: ", expectedTokenManagerAddress);

  // ON Sepolia
  //   owner.address:  0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C
  // salt:  0x5a3c82f6a0b4cab0f9be948dc6957b2149b2b74cbdb77fbf7730c2f9e0196344
  // params:  0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000004e703bd524eaa03f3685026a2428e3fdf258da370000000000000000000000000000000000000000000000000000000000000014510e5ea32386b7c48c4deeac80e86859b5e2416c000000000000000000000000
  // txn_hash: '0xe7884f23a11ecb6bfd37f9f662a47badacee96fe645d2c797ea42eec61182a83',
  // tokenId:  0x3248e3cc8f51b22ec80f6f2bbe5c08ea5e92aeb54ed0d1b6ef19febc1c792250
  // expectedTokenManagerAddress:  0x88EFC3788DdEF773cb99e2dBe25c55771E9D943b
}

// Deploy TM to remote chain: Binance
async function deployRemoteTokenManager() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  const tokenManagerContract = new ethers.Contract(
    tokenManagerAddress,
    tokenManagerContractABI,
    owner
  );

  console.log("owner.address: ", owner.address);

  const params = await tokenManagerContract.params(
    owner.address,
    binanceCustomTokenAddress
  );

  console.log("params: ", params);

  const txn = await interchainTokenServiceContract.deployTokenManager(
    "0x5a3c82f6a0b4cab0f9be948dc6957b2149b2b74cbdb77fbf7730c2f9e0196344", // salt
    "binance",
    MINT_BURN,
    params,
    ethers.utils.parseEther("0.01"),
    { value: ethers.utils.parseEther("0.02"), gasLimit: 3000000 }
  );

  console.log("txn: ", txn);

  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    owner.address,
    "0x5a3c82f6a0b4cab0f9be948dc6957b2149b2b74cbdb77fbf7730c2f9e0196344" // salt
  );

  console.log("tokenId: ", tokenId);

  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log("expectedTokenManagerAddress: ", expectedTokenManagerAddress);

  // ON Sepolia
  //   owner.address:  0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C
  // params:  0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000007ebf876f04064a88ba67f4ba60e6ece0bccbc88e0000000000000000000000000000000000000000000000000000000000000014510e5ea32386b7c48c4deeac80e86859b5e2416c000000000000000000000000
  // txn_hash: ' g0x9d5720fcf70f5e205af80ee3d1a6c6f387d7c1cae2de769af4b91ef3fe5137f2',
  // tokenId:  0x3248e3cc8f51b22ec80f6f2bbe5c08ea5e92aeb54ed0d1b6ef19febc1c792250
  // expectedTokenManagerAddress:  0x88EFC3788DdEF773cb99e2dBe25c55771E9D943b
}

// Transfer Mintership on all chains to ITS : Sepolia
async function transferMintershipToITSOnSepolia() {
  const [owner] = await ethers.getSigners();

  const TestMintableBurnableERC20Contract = new ethers.Contract(
    sepoliaCustomTokenAddress,
    TestMintableBurnableERC20ContractABI,
    owner
  );

  // Transfer mintership to ITS
  const txn = await TestMintableBurnableERC20Contract.transferMintership(
    interchainTokenServiceContractAddress
  );

  console.log("Txn:  ", txn);

  // ON Sepolia
  //0x17ff510551c51eee8c825109a03fc515cab0941bc6cc485b0f9960f7f8ef39ed
}

// Transfer Mintership on all chains to ITS : Binance
async function transferMintershipToITSOnBinance() {
  const [owner] = await ethers.getSigners();

  const TestMintableBurnableERC20Contract = new ethers.Contract(
    binanceCustomTokenAddress,
    TestMintableBurnableERC20ContractABI,
    owner
  );

  // Transfer mintership to ITS
  const txn = await TestMintableBurnableERC20Contract.transferMintership(
    interchainTokenServiceContractAddress
  );

  console.log("Txn:  ", txn);

  // ON Binance
  // 0x2b4e46efd5054f853ac183c5911baf634fbbda3615bbfff476053d3662f87483
}

// Transfer tokens : Sepolia -> Binance
async function transferTokens() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  const transfer = await interchainTokenServiceContract.interchainTransfer(
    "0x3248e3cc8f51b22ec80f6f2bbe5c08ea5e92aeb54ed0d1b6ef19febc1c792250", // tokenId
    "binance", // destination chain
    "0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C", // recipient
    ethers.utils.parseEther("4"), // amount
    "0x00", //metadata
    ethers.utils.parseEther("0.1"),
    {
      // Transaction options should be passed here as an object
      value: ethers.utils.parseEther("0.1"), // Sending ether as the transaction value
      // gasLimit: 70000, // Specifying the gas limit
    }
  );

  console.log("transfer: ", transfer);

  // Interchain transfer transaction hash
  // txn_hash: 0xd2fc2cb79612acc43afc8cb9bf69332a34b996f749be4ad1135533e7f1752035
  // https://testnet.axelarscan.io/gmp/0xd2fc2cb79612acc43afc8cb9bf69332a34b996f749be4ad1135533e7f1752035
}

// Uncomment the function you want to run below before deploying
async function run() {
  try {
    // await deployLocalTokenManager();
    // await deployRemoteTokenManager();
    // await transferMintershipToITSOnSepolia();
    // await transferMintershipToITSOnBinance();
    // await transferTokens();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

run();

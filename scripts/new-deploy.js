// const hre = require("hardhat");
// // const { ethers } = require("hardhat");
// const crypto = require("crypto");
// const itsContractABI = require("../utils/its/abi");
// const tokenManagerMintBurnABI = require("../utils/its/tokenmanagermintburnabi");

// const MINT_BURN = 0;
// const LOCK_UNLOCK = 2;
// const tokenAddress = "0xaaB81B2CBcd08d6bCF62CCc824958195826716b3";
// const ITSContractAddress = "0xa4A9965149388c86E62CDDDd6C95EFe9c294005a";
// const tokenManagerMintBurnAddress =
//   "0x66689C684B2d4EA971E9aA4EBC34061949CA457d";
// const tokenManagerMintBurnFromAddress =
//   "0x4b8fa7DCfB59950bA8755b54ec9dBEe2f0F3a512";
// const tokenManagerLockUnlockAddress =
//   "0x1E063c4162Eb0447092590E5BFcd2fE192E57D62";
// const tokenManagerLockUnlockFeeAddress =
//   "0x89aEF97F9c5023035AB631313ED8A1621E218820";
// const implementationAddress = "0xdf7A27fC918A8D0f571656EcF5B70Fa126D090B8";

// // ITS
// // async function main() {
// //   const [owner] = await ethers.getSigners();
// //   const salt = "0x" + crypto.randomBytes(32).toString("hex");

// //   const ITSContract = new ethers.Contract(
// //     ITSContractAddress,
// //     itsContractABI,
// //     owner
// //   );

// //   console.log("salt: ", salt);
// //   const data = await ITSContract.interchainTokenId(owner.address, salt);
// //   console.log(data);

// //   // salt:  0xb3d81bd260735a59c3e548e9b27044aaac79bdad251ce0632292a9adef6e4dec
// //   // tokenId 0xa42336f398a530673d391edfc25f4ec48e2e506901ec0350718ec7d838750aa8
// // }

// async function main() {
//   const [owner] = await ethers.getSigners();

//   const TMMintBurnContract = new ethers.Contract(
//     tokenManagerMintBurnAddress,
//     tokenManagerMintBurnABI,
//     owner
//   );

//   const params = await TMMintBurnContract.params(owner.address, tokenAddress);
//   console.log("params: ", params);

//   const ITSContract = new ethers.Contract(
//     ITSContractAddress,
//     itsContractABI,
//     owner
//   );
//   const txn = await ITSContract.deployTokenManager(
//     "0xb3d81bd260735a59c3e548e9b27044aaac79bdad251ce0632292a9adef6e4dec",
//     "",
//     MINT_BURN,
//     params,
//     0
//   );
//   console.log("txn: ", txn);

//   // TM contract address 0x740A5a79d1F3DEDC8B80619e58146dd5b92c69DB
//   // TM hash 0xbfb55396aadf0dc9e4d8ed0e15abd7c1c89b979dba8be009ab1f6c0ae75fe52e
//   // Params 0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000aab81b2cbcd08d6bcf62ccc824958195826716b30000000000000000000000000000000000000000000000000000000000000014510e5ea32386b7c48c4deeac80e86859b5e2416c000000000000000000000000
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// // Goerli test
// const hre = require("hardhat");
// const crypto = require("crypto");
// const ITSContractABI = require("../utils/its/abi");
// const tokenManagerMintBurnABI = require("../utils/its/tokenmanagermintburnabi");

// const MINT_BURN = 0;
// const LOCK_UNLOCK = 2;

// const tokenAddress = "0xaaB81B2CBcd08d6bCF62CCc824958195826716b3";
// const ITSContractAddress = "0xa4A9965149388c86E62CDDDd6C95EFe9c294005a";
// const tokenManagerMintBurnAddress =
//   "0xA8e851ab79510c50A7A4cae6b4a74651c33a3088";
// const tokenManagerMintBurnFromAddress =
//   "0x924808967AF5E7533F294F7b27E7d78247263b19";
// const tokenManagerLockUnlockAddress =
//   "0x7c4D1846936a24341054A3E503532a703F595Cab";
// const tokenManagerLockUnlockFeeAddress =
//   "0xa93e914F31b7afcA01709c0919BeBe0D9a61c445";
// const implementationAddress = "0x226Fc9CD25cf82F7025C733C9a3a57C82B64A496";

// // Deploy if you don't have tokenId yet, you can use the tokenId to retrieve the tokenMangerAddress later on ITS
// // async function main() {
// //   const [owner] = await ethers.getSigners();
// //   const salt = "0x" + crypto.randomBytes(32).toString("hex");

// //   const ITSContract = new ethers.Contract(
// //     ITSContractAddress,
// //     ITSContractABI,
// //     owner
// //   );

// //   console.log("salt: ", salt);

// //   const txn = await ITSContract.interchainTokenId(owner.address, salt);
// //   console.log("tokenId: ", txn);

// //   // salt:  0x530713ea35d2f2c2e2876e2e57b95417a864b89cbbec24c32efa77b235b81c2d
// //   // tokenId 0x9ee35a85e48f9065734427e0c02441f0f3999f93c5cdaa1dac3f663aec3ecf99
// // }

// async function main() {
//   const [owner] = await ethers.getSigners();

//   const TMMintBurnContract = new ethers.Contract(
//     tokenManagerMintBurnAddress,
//     tokenManagerMintBurnABI,
//     owner
//   );

//   const params = await TMMintBurnContract.params(owner.address, tokenAddress);
//   console.log("params: ", params);

//   const ITSContract = new ethers.Contract(
//     ITSContractAddress,
//     ITSContractABI,
//     owner
//   );
//   const txn = await ITSContract.deployTokenManager(
//     "0x530713ea35d2f2c2e2876e2e57b95417a864b89cbbec24c32efa77b235b81c2d",
//     "",
//     MINT_BURN,
//     params,
//     0
//   );
//   console.log("txn: ", txn);

//   // Token Manager hash 0x6a765ec2365ed349f6fd202a04cbd11766371cb53e6188e86ab2f2bb6e7ff012
//   // https://goerli.etherscan.io/tx/0x6a765ec2365ed349f6fd202a04cbd11766371cb53e6188e86ab2f2bb6e7ff012
//   // Params 0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000aab81b2cbcd08d6bcf62ccc824958195826716b30000000000000000000000000000000000000000000000000000000000000014510e5ea32386b7c48c4deeac80e86859b5e2416c000000000000000000000000
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// Base Goerli test
const hre = require("hardhat");
const crypto = require("crypto");
const ITSContractABI = require("../utils/its/interchainTokenServiceABI");
// const tokenManagerMintBurnABI = require("../utils/its/tokenmanagermintburnabi");
const { getContractAt, Wallet } = ethers;

const MINT_BURN = 0;
const LOCK_UNLOCK = 2;

const tokenAddress = "0x22C0e915197C90CF2147eA002123066c084cbE7d";
const ITSContractAddress = "0xa4A9965149388c86E62CDDDd6C95EFe9c294005a";
const tokenManagerMintBurnAddress =
  "0xaA82eE3cC9EcA484fCcDD38d83190f823A79F482";
const tokenManagerMintBurnFromAddress =
  "0xfaF9cefE974572f6eBB83B48714F3c30cC07bBBB";
const tokenManagerLockUnlockAddress =
  "0x09E2aCde39FBd22df15103aEaee2Fc070fEcfA95";
const tokenManagerLockUnlockFeeAddress =
  "0xaA057BC49FaA0729FeBA4849Bb4F27467FB99922";
const implementationAddress = "0x4fBC050318D567a53732296Bd5ef6c049766456b";

// Deploy if you don't have tokenId yet, you can use the tokenId to retrieve the tokenMangerAddress later on ITS
// async function main() {
//   const [owner] = await ethers.getSigners();
//   const salt = "0x" + crypto.randomBytes(32).toString("hex");

//   const ITSContract = new ethers.Contract(
//     ITSContractAddress,
//     ITSContractABI,
//     owner
//   );

//   console.log("salt: ", salt);

//   const txn = await ITSContract.interchainTokenId(owner.address, salt);
//   console.log("tokenId: ", txn);

//   // salt:  0xcff4fb4e5481934ddc306eeed4683153342de8e6882200310b8532427d041beb
//   // tokenId 0x025e1668d14a34188773252fbf78ebd371243918c075a564e202b8dda2895709
// }

async function main() {
  const [owner] = await ethers.getSigners();

  const ITSContract = new ethers.Contract(
    ITSContractAddress,
    ITSContractABI,
    owner
  );

  const implementationAddress = await ITSContract.tokenManagerImplementation(
    MINT_BURN
  );
  const tokenManagerImplementation = await getContractAt(
    "TokenManagerMintBurn",
    implementationAddress,
    owner
  );

  //   const TMMintBurnContract = new ethers.Contract(
  //     tokenManagerMintBurnAddress,
  //     tokenManagerMintBurnABI,
  //     owner
  //   );

  const params = await tokenManagerImplementation.params(
    owner.address,
    tokenAddress
  );
  console.log("params: ", params);

  const txn = await ITSContract.deployTokenManager(
    "0xcff4fb4e5481934ddc306eeed4683153342de8e6882200310b8532427d041beb",
    "",
    MINT_BURN,
    params,
    0
  );
  console.log("txn: ", txn);

  // New

  // Token Manager hash 0x22d1a86ab20265b32c1a8c13d609ff92fedeb2968e103d07425f4bcbd9a811d8
  // https://goerli.basescan.org/tx/0x22d1a86ab20265b32c1a8c13d609ff92fedeb2968e103d07425f4bcbd9a811d8
  // Params 0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000022c0e915197c90cf2147ea002123066c084cbe7d0000000000000000000000000000000000000000000000000000000000000014510e5ea32386b7c48c4deeac80e86859b5e2416c000000000000000000000000
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

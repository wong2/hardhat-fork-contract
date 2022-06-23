import { impersonateAccount, setBalance } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, forkContract } from "./lib/fork-contract.mjs";

// override contract state

const contract = await forkContract("0xED5AF388653567Af2F388E6224dC7C4b3241C544", {
  _baseTokenURI: "https://replaced.com/",
});

console.log(await contract.tokenURI(123)); // https://replaced.com/123

// impersonate contract owner

const owner = await contract.owner();

await impersonateAccount(owner);
await setBalance(owner, ethers.utils.parseEther("100"));

await contract.connect(ethers.provider.getSigner(owner)).setBaseURI("https://replaced2.com/");

console.log(await contract.tokenURI(123)); // https://replaced2.com/123

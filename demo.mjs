import { forkContract } from "./lib/fork-contract.mjs";

const contract = await forkContract("0xED5AF388653567Af2F388E6224dC7C4b3241C544", {
  _baseTokenURI: "https://replaced.com/",
});

console.log(await contract.tokenURI(123));

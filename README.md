### A demo using Hardhat to fork mainnet and override contract state

### Sample Code

```
import { forkContract } from "./lib/fork-contract.mjs";

const contract = await forkContract("0xED5AF388653567Af2F388E6224dC7C4b3241C544", {
  _baseTokenURI: "https://replaced.com/",
});

console.log(await contract.tokenURI(123));
```

From now on you can also use `hardhat-network-helpers` to do some manipulations. For example, to impersonate specific accounts.

### Reference

https://hardhat.org/hardhat-network/guides/mainnet-forking

https://hardhat.org/network-helpers

https://docs.soliditylang.org/en/v0.8.15/internals/layout_in_storage.html

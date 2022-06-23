require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.ankr.com/eth",
      },
    },
  },
  etherscan: {
    apiKey: "", // set your etherscan api key
  },
};

import axios from "axios";
import hre from "hardhat";

const API_KEY = hre.userConfig.etherscan.apiKey;

async function fetchSourceCode(contractAddress) {
  const resp = await axios.get("https://api.etherscan.io/api", {
    params: {
      module: "contract",
      action: "getsourcecode",
      address: contractAddress,
      apikey: API_KEY,
    },
  });
  return resp.data.result[0];
}

export { fetchSourceCode };

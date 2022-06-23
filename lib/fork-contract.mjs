import helpers from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import { flatten } from "lodash-es";
import { downloadCompiler } from "./compiler.mjs";
import { fetchSourceCode } from "./utils/etherscan.mjs";
import { getStorageOverrides, getVariablePosition } from "./utils/storage.mjs";

const ethers = hre.ethers;

async function forkContract(contractAddress, stateOverrides = {}) {
  console.debug("Fetching source code from Etherscan...");
  const sourceCodeResponse = await fetchSourceCode(contractAddress);
  console.debug("Source code fetched");

  console.debug("Downloading compiler", sourceCodeResponse.CompilerVersion);
  const compiler = await downloadCompiler(sourceCodeResponse.CompilerVersion);
  console.debug("Compiler downloaded");

  const sourceInput = JSON.parse(sourceCodeResponse.SourceCode.slice(1, -1));
  sourceInput.settings.outputSelection = {
    "*": {
      [sourceCodeResponse.ContractName]: ["abi", "storageLayout"],
    },
  };

  const compileOutput = JSON.parse(compiler.compile(JSON.stringify(sourceInput)));

  const { abi, storageLayout } = Object.values(compileOutput.contracts)[0][
    sourceCodeResponse.ContractName
  ];

  const storageOverrides = flatten(
    Object.entries(stateOverrides).map(([varaible, value]) => {
      const pos = getVariablePosition(storageLayout.storage, varaible);
      return getStorageOverrides(pos, value);
    })
  );

  await Promise.all(
    storageOverrides.map(async ({ pos, value }) => {
      await helpers.setStorageAt(contractAddress, pos, value);
    })
  );

  return ethers.getContractAt(abi, contractAddress);
}

export { ethers, forkContract };

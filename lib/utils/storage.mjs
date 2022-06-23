import { ethers } from "ethers";
import { chunk } from "lodash-es";

function getVariablePosition(storage, variable) {
  for (const s of storage) {
    if (s.label === variable) {
      return Number(s.slot);
    }
  }
  throw new Error(`Cant find storage position for ${variable}`);
}

function encodeShortString(byteArray) {
  const ret = [...byteArray];
  for (let i = 0; i < 31 - byteArray.length; i++) {
    ret.push(0);
  }
  ret.push(byteArray.length * 2);
  return ethers.utils.hexlify(ret);
}

function getStorageOverrides(pos, value) {
  if (typeof value !== "string" || value.startsWith("0x")) {
    return [{ pos, value }];
  }
  const array = ethers.utils.toUtf8Bytes(value);
  if (array.length < 32) {
    return [{ pos, value: encodeShortString(array) }];
  }
  let newPos = ethers.BigNumber.from(ethers.utils.keccak256(ethers.utils.hexZeroPad(pos, 32)));
  const ret = [{ pos, value: array.length * 2 + 1 }];
  for (const part of chunk(array, 32)) {
    if (part.length === 32) {
      ret.push({ pos: newPos.toHexString(), value: ethers.utils.hexlify(part) });
    } else {
      ret.push({ pos: newPos.toHexString(), value: encodeShortString(part) });
    }
    newPos = newPos.add(1);
  }
  return ret;
}

export { getVariablePosition, getStorageOverrides };

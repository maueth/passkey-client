import {UserOperationStruct} from "@account-abstraction/contracts";
import {ethers} from "ethers";
import {utils} from "@passwordless-id/webauthn";

export const createChallenge = () => {
  const userOp = buildUserOperation();
  const userOpHash = generateUserOpHash(userOp);
  const challenge = utils
    .toBase64url(ethers.utils.arrayify(userOpHash))
    .replace(/=/g, "");

  return challenge;
};

export const generateUserOpHash = (userOp: UserOperationStruct): string => {
  const types = [
    "address", // for sender
    "uint256", // for nonce
    "bytes", // for initCode
    "bytes", // for callData
    "uint256", // for callGasLimit
    "uint256", // for verificationGasLimit
    "uint256", // for preVerificationGas
    "uint256", // for maxFeePerGas
    "uint256", // for maxPriorityFeePerGas
    "bytes", // for paymasterAndData
    "bytes", // for signature
  ];

  const values = [
    userOp.sender,
    userOp.nonce,
    userOp.initCode,
    userOp.callData,
    userOp.callGasLimit,
    userOp.verificationGasLimit,
    userOp.preVerificationGas,
    userOp.maxFeePerGas,
    userOp.maxPriorityFeePerGas,
    userOp.paymasterAndData,
    userOp.signature,
  ];

  // @todo encode with account contract and chain id
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(types, values)
  );
};

export const buildUserOperation = () => {
  const userOp: UserOperationStruct = {
    sender: "0x58aEdD5a35111f2DEFd03b14ae0020D8b5845902",
    nonce: 1,
    initCode: ethers.utils.formatBytes32String(""),
    callData: ethers.utils.formatBytes32String(""),
    callGasLimit: 300000,
    verificationGasLimit: 200000,
    preVerificationGas: 100000,
    maxFeePerGas: 100,
    maxPriorityFeePerGas: 10,
    paymasterAndData: "0xabcd",
    signature: "0xabcd",
  };

  return userOp;
};

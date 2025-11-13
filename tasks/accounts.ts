import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("accounts", "Prints the list of accounts").setAction(async function (_taskArguments: TaskArguments, hre) {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});


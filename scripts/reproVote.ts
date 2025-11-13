import hre from "hardhat";

async function main() {
  const [deployer, voter] = await hre.ethers.getSigners();
  console.log("Deployer", deployer.address);
  console.log("Voter", voter.address);

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const surveyId = 0;

  const contract = await hre.ethers.getContractAt(
    "GamePreferenceSurvey",
    contractAddress,
    voter
  );

  await hre.fhevm.assertCoprocessorInitialized(contractAddress, "GamePreferenceSurvey");

  const input = hre.fhevm.createEncryptedInput(
    contractAddress,
    voter.address
  );
  input.add8(1);
  const encrypted = await input.encrypt();

  const tx = await contract.submitResponse(
    surveyId,
    encrypted.handles[0],
    encrypted.handles[0],
    encrypted.handles[0],
    encrypted.handles[0],
    encrypted.inputProof,
    encrypted.inputProof,
    encrypted.inputProof,
    encrypted.inputProof
  );

  console.log("tx hash", tx.hash);
  await tx.wait();
}

main().catch((error) => {
  console.error("Failed", error);
  process.exitCode = 1;
});


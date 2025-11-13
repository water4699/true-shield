import hre from "hardhat";

async function main() {
  const addresses = {
    ACL: "0x50157CFfD6bBFA2DECe204a89ec419c23ef5755D",
    Coprocessor: "0xCD3ab3bd6bcc0c0bf3E27912a92043e817B1cf69",
    InputVerifier: "0x901F8942346f7AB3a01F6D7613119Bca447Bb030",
    KMSVerifier: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
  };

  for (const [name, address] of Object.entries(addresses)) {
    const code = await hre.ethers.provider.getCode(address);
    console.log(name, address, code.length > 2 ? "deployed" : "missing");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


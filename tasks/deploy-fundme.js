const { task } = require("hardhat/config");

task("deploy-fundme", "deploy and verify fundme contract").setAction(
  async (taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe");
    console.log("Deploying FundMe...");
    const fundMe = await fundMeFactory.deploy(300); // 0.001 ETH
    await fundMe.waitForDeployment();
    console.log("FundMe deployed to:", fundMe.target);

    if (
      hre.network.config.chainId == 11155111 &&
      process.env.ETHERSCAN_API_KEY
    ) {
      console.log("Waiting for 5 blocks...");
      await fundMe.deploymentTransaction().wait(5);
      verifyContract(fundMe.target, [300]);
    } else {
      console.log("Skipping verification on Etherscan...");
    }
  }
);

async function verifyContract(addr, arges) {
  console.log("Verifying FundMe contract...");
  await hre.run("verify:verify", {
    address: addr,
    constructorArguments: arges,
  });
}

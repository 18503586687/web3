const { ethers } = require("hardhat");
async function main() {
  // We get the contract to deploy
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("Deploying FundMe...");
  const fundMe = await fundMeFactory.deploy(300); // 0.001 ETH
  await fundMe.waitForDeployment();
  console.log("FundMe deployed to:", fundMe.target);

  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 5 blocks...");
    await fundMe.deploymentTransaction().wait(5);
    verifyContract(fundMe.target, [300]);
  } else {
    console.log("Skipping verification on Etherscan...");
  }

  // init 2 accounts
  const [firstAccount, secondAccount] = await ethers.getSigners();

  // fund contract with first account
  const fundTx = await fundMe.fund({ value: ethers.parseEther("0.01") });
  await fundTx.wait();

  console.log(
    `2 accounts are ${firstAccount.address} and ${secondAccount.address}`
  );

  // check balance of contract
  const balanceOfContract = await ethers.provider.getBalance(fundMe.target);
  console.log(`Balance of the contract is ${balanceOfContract}`);

  // fund contract with second account
  const fundTxWithSecondAccount = await fundMe
    .connect(secondAccount)
    .fund({ value: ethers.parseEther("0.01") });
  await fundTxWithSecondAccount.wait();

  // check balance of contract
  const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(
    fundMe.target
  );
  console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`);

  // check mapping
  const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(
    firstAccount.address
  );
  const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(
    secondAccount.address
  );
  console.log(
    `Balance of first account ${firstAccount.address} is ${firstAccountbalanceInFundMe}`
  );
  console.log(
    `Balance of second account ${secondAccount.address} is ${secondAccountbalanceInFundMe}`
  );
}

async function verifyContract(addr, arges) {
  console.log("Verifying FundMe contract...");
  await hre.run("verify:verify", {
    address: addr,
    constructorArguments: arges,
  });
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

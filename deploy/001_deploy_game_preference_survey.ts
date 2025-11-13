import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const gamePreferenceSurvey = await deploy("GamePreferenceSurvey", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`GamePreferenceSurvey contract deployed at: ${gamePreferenceSurvey.address}`);
};

export default func;
func.id = "deploy_game_preference_survey";
func.tags = ["GamePreferenceSurvey"];


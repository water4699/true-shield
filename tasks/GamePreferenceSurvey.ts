import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:getAdmin", "Get admin address")
  .addParam("contract", "The GamePreferenceSurvey contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { contract } = taskArguments;
    const GamePreferenceSurvey = await hre.ethers.getContractAt("GamePreferenceSurvey", contract);
    const admin = await GamePreferenceSurvey.getAdmin();
    console.log(`Admin address: ${admin}`);
  });

task("task:createSurvey", "Create a new survey")
  .addParam("contract", "The GamePreferenceSurvey contract address")
  .addParam("title", "Survey title")
  .addParam("description", "Survey description")
  .addParam("duration", "Duration in seconds")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { contract, title, description, duration } = taskArguments;
    const GamePreferenceSurvey = await hre.ethers.getContractAt("GamePreferenceSurvey", contract);
    const tx = await GamePreferenceSurvey.createSurvey(title, description, duration);
    await tx.wait();
    console.log(`Survey created successfully! Transaction: ${tx.hash}`);
  });

task("task:getSurvey", "Get survey details")
  .addParam("contract", "The GamePreferenceSurvey contract address")
  .addParam("surveyid", "Survey ID")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { contract, surveyid } = taskArguments;
    const GamePreferenceSurvey = await hre.ethers.getContractAt("GamePreferenceSurvey", contract);
    const survey = await GamePreferenceSurvey.getSurvey(surveyid);
    console.log(`Survey Details:
      Title: ${survey[0]}
      Description: ${survey[1]}
      Deadline: ${new Date(Number(survey[2]) * 1000).toLocaleString()}
      Active: ${survey[3]}
      Total Responses: ${survey[4]}`);
  });

task("task:getSurveyCount", "Get total number of surveys")
  .addParam("contract", "The GamePreferenceSurvey contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { contract } = taskArguments;
    const GamePreferenceSurvey = await hre.ethers.getContractAt("GamePreferenceSurvey", contract);
    const count = await GamePreferenceSurvey.getSurveyCount();
    console.log(`Total surveys: ${count}`);
  });


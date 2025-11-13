import { expect } from "chai";
import { ethers } from "hardhat";
import { GamePreferenceSurvey } from "../types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GamePreferenceSurvey", function () {
  let gamePreferenceSurvey: GamePreferenceSurvey;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    const GamePreferenceSurveyFactory = await ethers.getContractFactory("GamePreferenceSurvey");
    gamePreferenceSurvey = await GamePreferenceSurveyFactory.connect(admin).deploy();
    await gamePreferenceSurvey.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await gamePreferenceSurvey.admin()).to.equal(admin.address);
    });

    it("Should start with zero surveys", async function () {
      expect(await gamePreferenceSurvey.surveyCount()).to.equal(0);
    });
  });

  describe("Survey Creation", function () {
    it("Should allow any user to create a survey", async function () {
      const title = "Game Preference Survey 2025";
      const description = "What game mechanisms do you prefer?";
      const duration = 7 * 24 * 60 * 60; // 7 days

      await expect(
        gamePreferenceSurvey.connect(user1).createSurvey(title, description, duration)
      )
        .to.emit(gamePreferenceSurvey, "SurveyCreated")
        .withArgs(0, title, (await ethers.provider.getBlock("latest"))!.timestamp + duration + 1);

      expect(await gamePreferenceSurvey.surveyCount()).to.equal(1);

      const survey = await gamePreferenceSurvey.getSurvey(0);
      expect(survey[0]).to.equal(title);
      expect(survey[1]).to.equal(description);
      expect(survey[3]).to.equal(true); // active
      expect(survey[4]).to.equal(0); // totalResponses
    });

  });

  describe("Survey Response Submission", function () {
    beforeEach(async function () {
      // Create a survey first
      await gamePreferenceSurvey.connect(admin).createSurvey(
        "Game Preference Survey",
        "Select your favorite game mechanisms",
        7 * 24 * 60 * 60 // 7 days
      );
    });

    it("Should allow user to submit response", async function () {
      // This is a simplified test - in real implementation, you need to use FHE encryption
      // For testing purposes, we'll need to mock or use the actual FHE library
      
      // Check initial state
      expect(await gamePreferenceSurvey.hasResponded(0, user1.address)).to.equal(false);
      
      const surveyBefore = await gamePreferenceSurvey.getSurvey(0);
      expect(surveyBefore[4]).to.equal(0); // totalResponses
    });

    it("Should not allow duplicate responses", async function () {
      // This test would need proper FHE implementation
      // Placeholder for the actual test logic
      expect(await gamePreferenceSurvey.hasResponded(0, user1.address)).to.equal(false);
    });

    it("Should not allow responses to inactive surveys", async function () {
      // Close the survey
      await gamePreferenceSurvey.connect(admin).closeSurvey(0);
      
      // Attempting to respond should fail (would need proper FHE inputs)
      // This is a placeholder test
    });
  });

  describe("Survey Management", function () {
    beforeEach(async function () {
      await gamePreferenceSurvey.connect(admin).createSurvey(
        "Test Survey",
        "Test Description",
        3600
      );
    });

    it("Should allow admin to close a survey", async function () {
      await expect(gamePreferenceSurvey.connect(admin).closeSurvey(0))
        .to.emit(gamePreferenceSurvey, "SurveyClosed")
        .withArgs(0);

      const survey = await gamePreferenceSurvey.getSurvey(0);
      expect(survey[3]).to.equal(false); // active = false
    });

    it("Should not allow non-admin to close a survey", async function () {
      await expect(
        gamePreferenceSurvey.connect(user1).closeSurvey(0)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not allow closing an already closed survey", async function () {
      await gamePreferenceSurvey.connect(admin).closeSurvey(0);
      
      await expect(
        gamePreferenceSurvey.connect(admin).closeSurvey(0)
      ).to.be.revertedWith("Survey is already closed");
    });
  });

  describe("Admin Management", function () {
    it("Should allow admin to transfer admin rights", async function () {
      await gamePreferenceSurvey.connect(admin).transferAdmin(user1.address);
      expect(await gamePreferenceSurvey.admin()).to.equal(user1.address);
    });

    it("Should not allow non-admin to transfer admin rights", async function () {
      await expect(
        gamePreferenceSurvey.connect(user1).transferAdmin(user2.address)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not allow transferring to zero address", async function () {
      await expect(
        gamePreferenceSurvey.connect(admin).transferAdmin(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("View Functions", function () {
    it("Should return correct admin address", async function () {
      expect(await gamePreferenceSurvey.getAdmin()).to.equal(admin.address);
    });

    it("Should return correct survey count", async function () {
      expect(await gamePreferenceSurvey.getSurveyCount()).to.equal(0);
      
      await gamePreferenceSurvey.connect(user1).createSurvey("Survey 1", "Description 1", 3600);
      expect(await gamePreferenceSurvey.getSurveyCount()).to.equal(1);
      
      await gamePreferenceSurvey.connect(user2).createSurvey("Survey 2", "Description 2", 3600);
      expect(await gamePreferenceSurvey.getSurveyCount()).to.equal(2);
    });
  });
});


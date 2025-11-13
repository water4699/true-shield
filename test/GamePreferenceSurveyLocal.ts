import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { GamePreferenceSurvey } from "../types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GamePreferenceSurvey - Local Network Integration", function () {
  let gamePreferenceSurvey: GamePreferenceSurvey;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  before(async function () {
    [admin, user1, user2, user3] = await ethers.getSigners();

    // Deploy using hardhat-deploy
    await deployments.fixture(["GamePreferenceSurvey"]);
    const deployment = await deployments.get("GamePreferenceSurvey");
    
    gamePreferenceSurvey = await ethers.getContractAt(
      "GamePreferenceSurvey",
      deployment.address
    ) as unknown as GamePreferenceSurvey;

    console.log(`\n📝 GamePreferenceSurvey deployed at: ${deployment.address}`);
    console.log(`👤 Admin: ${admin.address}`);
    console.log(`👥 User1: ${user1.address}`);
    console.log(`👥 User2: ${user2.address}`);
    console.log(`👥 User3: ${user3.address}\n`);
  });

  describe("📊 Full Survey Lifecycle", function () {
    let surveyId: bigint;

    it("1️⃣ Admin creates a new game preference survey", async function () {
      const title = "GameFi Preference Survey 2025";
      const description = "Help us understand your favorite game mechanisms: PVP, PVE, Economic System, or Others";
      const duration = 7 * 24 * 60 * 60; // 7 days

      const tx = await gamePreferenceSurvey.connect(admin).createSurvey(
        title,
        description,
        duration
      );
      const receipt = await tx.wait();

      console.log(`✅ Survey created! Transaction: ${receipt?.hash}`);

      surveyId = await gamePreferenceSurvey.surveyCount() - 1n;
      const survey = await gamePreferenceSurvey.getSurvey(surveyId);

      expect(survey[0]).to.equal(title);
      expect(survey[1]).to.equal(description);
      expect(survey[3]).to.equal(true); // active
      expect(survey[4]).to.equal(0); // totalResponses

      console.log(`📋 Survey ID: ${surveyId}`);
      console.log(`📝 Title: ${survey[0]}`);
      console.log(`📅 Deadline: ${new Date(Number(survey[2]) * 1000).toLocaleString()}`);
      console.log(`🔄 Active: ${survey[3]}`);
    });

    it("2️⃣ Check survey details", async function () {
      const count = await gamePreferenceSurvey.getSurveyCount();
      console.log(`\n📊 Total surveys in system: ${count}`);

      const survey = await gamePreferenceSurvey.getSurvey(surveyId);
      console.log(`\n📋 Survey Details:`);
      console.log(`   Title: ${survey[0]}`);
      console.log(`   Description: ${survey[1]}`);
      console.log(`   Active: ${survey[3]}`);
      console.log(`   Total Responses: ${survey[4]}`);

      expect(count).to.be.greaterThan(0);
      expect(survey[3]).to.equal(true);
    });

    it("3️⃣ Verify response status for users", async function () {
      const hasUser1Responded = await gamePreferenceSurvey.hasResponded(surveyId, user1.address);
      const hasUser2Responded = await gamePreferenceSurvey.hasResponded(surveyId, user2.address);
      const hasUser3Responded = await gamePreferenceSurvey.hasResponded(surveyId, user3.address);

      console.log(`\n👥 Response Status:`);
      console.log(`   User1 has responded: ${hasUser1Responded}`);
      console.log(`   User2 has responded: ${hasUser2Responded}`);
      console.log(`   User3 has responded: ${hasUser3Responded}`);

      expect(hasUser1Responded).to.equal(false);
      expect(hasUser2Responded).to.equal(false);
      expect(hasUser3Responded).to.equal(false);
    });

    it("4️⃣ Admin can close the survey", async function () {
      const tx = await gamePreferenceSurvey.connect(admin).closeSurvey(surveyId);
      await tx.wait();

      console.log(`\n🔒 Survey closed by admin`);

      const survey = await gamePreferenceSurvey.getSurvey(surveyId);
      expect(survey[3]).to.equal(false); // active = false

      console.log(`✅ Survey is now inactive`);
    });

    it("5️⃣ Create another survey for testing", async function () {
      const title = "Q2 2025 Game Mechanisms Survey";
      const description = "Vote for your preferred game mechanisms";
      const duration = 14 * 24 * 60 * 60; // 14 days

      const tx = await gamePreferenceSurvey.connect(admin).createSurvey(
        title,
        description,
        duration
      );
      await tx.wait();

      const newSurveyId = await gamePreferenceSurvey.surveyCount() - 1n;
      console.log(`\n✅ New survey created with ID: ${newSurveyId}`);

      const survey = await gamePreferenceSurvey.getSurvey(newSurveyId);
      console.log(`📝 Title: ${survey[0]}`);
      console.log(`🔄 Active: ${survey[3]}`);

      expect(survey[3]).to.equal(true);
    });
  });

  describe("🔐 Permission Tests", function () {
    it("✅ Any connected user can create a survey", async function () {
      const tx = await gamePreferenceSurvey.connect(user1).createSurvey(
        "Community Survey",
        "Created by user1",
        3600
      );
      await tx.wait();

      const latestId = await gamePreferenceSurvey.getSurveyCount() - 1n;
      const survey = await gamePreferenceSurvey.getSurvey(latestId);

      expect(survey[0]).to.equal("Community Survey");
      expect(survey[1]).to.equal("Created by user1");

      console.log(`✅ user1 successfully created survey #${latestId}`);
    });

    it("❌ Non-admin cannot close survey", async function () {
      const surveyId = 0;
      await expect(
        gamePreferenceSurvey.connect(user1).closeSurvey(surveyId)
      ).to.be.revertedWith("Only admin can perform this action");

      console.log(`✅ Correctly prevented non-admin from closing survey`);
    });

    it("✅ Admin can transfer admin rights", async function () {
      const currentAdmin = await gamePreferenceSurvey.getAdmin();
      console.log(`\n👤 Current admin: ${currentAdmin}`);

      // Transfer to user1
      await gamePreferenceSurvey.connect(admin).transferAdmin(user1.address);
      
      const newAdmin = await gamePreferenceSurvey.getAdmin();
      console.log(`👤 New admin: ${newAdmin}`);
      
      expect(newAdmin).to.equal(user1.address);

      // Transfer back to original admin
      await gamePreferenceSurvey.connect(user1).transferAdmin(admin.address);
      
      const restoredAdmin = await gamePreferenceSurvey.getAdmin();
      console.log(`👤 Restored admin: ${restoredAdmin}`);
      
      expect(restoredAdmin).to.equal(admin.address);
    });
  });

  describe("📈 System Statistics", function () {
    it("Display final system state", async function () {
      const totalSurveys = await gamePreferenceSurvey.getSurveyCount();
      const adminAddress = await gamePreferenceSurvey.getAdmin();

      console.log(`\n═══════════════════════════════════════`);
      console.log(`📊 SYSTEM STATISTICS`);
      console.log(`═══════════════════════════════════════`);
      console.log(`📝 Total Surveys Created: ${totalSurveys}`);
      console.log(`👤 Current Admin: ${adminAddress}`);
      console.log(`💼 Contract Address: ${await gamePreferenceSurvey.getAddress()}`);
      
      for (let i = 0; i < Number(totalSurveys); i++) {
        const survey = await gamePreferenceSurvey.getSurvey(i);
        console.log(`\n   Survey #${i}:`);
        console.log(`   📝 Title: ${survey[0]}`);
        console.log(`   🔄 Active: ${survey[3]}`);
        console.log(`   👥 Responses: ${survey[4]}`);
      }
      console.log(`═══════════════════════════════════════\n`);
    });
  });
});


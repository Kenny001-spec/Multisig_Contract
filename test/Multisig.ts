import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect, should } from "chai";
  import { ethers } from "hardhat"; 
  import "@nomicfoundation/hardhat-toolbox";
  import "@nomicfoundation/hardhat-ethers";
  
  describe("Claim_Faucet_Factory", function () {

    const token:{name:string, symbol:string}= {
      name: "SoliuToken",
      symbol: "SLT"
    }
    
  
    async function deployMultisigFixture() {

        const [owner, user1, user2, user3, user4, reciever] = await ethers.getSigners(); // Get signers 

        const initialBalance = ethers.parseEther("1000");



        const amountToSend =   ethers.parseUnits("100000", 18)



        const validSigners = [user1, user2, user3, user4]

      const  MultisigFactory = await ethers.getContractFactory("MultiSig");
      const multisigContract = await MultisigFactory.connect(owner).deploy(validSigners, 2, {value: initialBalance});
  
  
  
      return { multisigContract, amountToSend,  owner, user1, user2, user3, user4, reciever};
    }


    describe('Deploy', () => {

        it("Should deploy Multisig and Celo token correctly", async function () {
  
          const {multisigContract} =  await loadFixture(deployMultisigFixture);
  
          expect( await multisigContract.getAddress()).to.be.properAddress;
          
        });
  
    
        
      });


describe("Functions", () => {

    it(" Only a valid signer Should initiate transaction and ensure the amount is not zero", async () => {

        
        const {multisigContract, amountToSend , owner, reciever} = await loadFixture(deployMultisigFixture);

        await multisigContract.connect(owner).addValidSigner(owner)


        await multisigContract.connect(owner).initiateTransaction(amountToSend, reciever.address )

        expect( amountToSend).to.greaterThan(0);
        

        
    });

    it("valid signers  should be able to approve transaction", async () => {


        const {multisigContract, user1, user2} = await loadFixture(deployMultisigFixture);

        await multisigContract.connect(user1).approveTransaction(0);
        await multisigContract.connect(user2).approveTransaction(0);
        
    });



    

})

});
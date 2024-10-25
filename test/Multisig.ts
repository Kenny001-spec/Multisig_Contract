import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
const { ethers } = require("hardhat");

describe("MultiSig Contract Tests", function () {

    async function deployMultiSigFixture() {
        const [owner, signer1, signer2, signer3, signer4, receiver, nonSigner] = await hre.ethers.getSigners();

        const MultiSig = await hre.ethers.getContractFactory("MultiSig");
        const multiSig = await MultiSig.deploy([signer1.address, signer2.address, signer3.address, signer4.address],
            2,
            { value: hre.ethers.parseEther("1") });

        return { multiSig, owner, signer1, signer2, signer3, signer4, receiver, nonSigner };
    }

    describe("MultiSig Contract Tests", function () {
        describe("Deployment", () => {
            it("Should check if the contract deployed and owner is set", async function () {
                const { multiSig, owner } = await loadFixture(deployMultiSigFixture);

                expect(await multiSig);
            });

            it(" Should be able to Initiiate transaction ", async function () {
                const { multiSig, signer1, receiver, nonSigner } = await loadFixture(deployMultiSigFixture);

                await expect(multiSig.connect(signer1).initiateTransaction(
                    hre.ethers.parseEther("0.1"),
                    receiver.address
                ))



                await expect(multiSig.connect(nonSigner).initiateTransaction(
                    hre.ethers.parseEther("0.1"),
                    receiver.address
                )).to.be.revertedWith("not valid signer");
            });

            it("Should approve transaction and execute on quorum", async function () {
                const { multiSig, signer1, signer2, receiver } = await loadFixture(deployMultiSigFixture);

        
                const amount = hre.ethers.parseEther("0.5");

           
                const txId = await multiSig.connect(signer1).initiateTransaction(amount, receiver.address);


                const txIdNumber = Number(txId);

                await expect(multiSig.connect(signer1).approveTransaction(txIdNumber))

                await expect(multiSig.connect(signer2).approveTransaction(txIdNumber))

                const transactions = await multiSig.getAllTransactions();
                const tx = transactions[txIdNumber];

            });

            it("Ownership transfer", async function () {
                const { multiSig, owner, nonSigner } = await loadFixture(deployMultiSigFixture);

                await multiSig.connect(owner).transferOwnership(nonSigner.address);

                await expect(multiSig.connect(nonSigner).claimOwnership())

            });

            

            it("Should remove a valid signer successfully", async function () {
                const { multiSig, owner, signer1, signer2 } = await loadFixture(deployMultiSigFixture);

                const index = 0;
                await multiSig.connect(owner).removeSigner(index);
            });

            it("should revert in case of Invalid operations", async function () {
                const { multiSig, owner, nonSigner, signer3, receiver } = await loadFixture(deployMultiSigFixture);
              
                await multiSig.connect(signer3).initiateTransaction(
                    hre.ethers.parseEther("0.1"),
                    receiver.address
                );
            });
            






        })


    });
})
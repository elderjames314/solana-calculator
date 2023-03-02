const assert = require("assert");
import * as anchor from "@project-serum/anchor";
const { SystemProgram } = anchor.web3;

describe("mycalculator", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatordapp;

  it("Create a calculator", async () => {
    await program.rpc.create("welcome to solana", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator],
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.greeting === "welcome to solana");
  });

  it("add two numbers", async () => {
    await program.rpc.add(new anchor.BN(2), new anchor.BN(45), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(47)));
  });

  it("substract two numbers", async () => {
    await program.rpc.substract(new anchor.BN(45), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(43)));
  });

  it("multiply two numbers", async () => {
    await program.rpc.multiply(new anchor.BN(45), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.result.eq(new anchor.BN(90)));
  });

   it("divide two numbers", async () => {
     await program.rpc.divide(new anchor.BN(40), new anchor.BN(2), {
       accounts: {
         calculator: calculator.publicKey,
       },
     });
     const account = await program.account.calculator.fetch(
       calculator.publicKey
     );
     assert.ok(account.result.eq(new anchor.BN(20)));
     assert.ok(account.reminder.eq(new anchor.BN(0)));
   });
});

import { acceptedMint } from "@/utils/solana";
import { BN } from "bn.js";
import { allPdas } from "@/utils/find-pda";
import { PublicKey } from "@solana/web3.js";

interface createEventInterface {
  name: string,
  price: number,
  publicKey: PublicKey | null,
  program: any
}

export async function createEvent({ name, price, publicKey, program }: createEventInterface) {
  if (!publicKey) return;
  const eventId = Date.now().toString();

  try {
    const {
      eventMintPublicKey,
      eventPublicKey,
      gainVaultPdaPublicKey,
      treasuryVaultPublicKey,
    } = allPdas({ eventId, programId: program.programId, publicKey });

    const tx = await program.methods
      .createEvent(eventId, name, new BN(price))
      .accounts({
        event: eventPublicKey,
        acceptedMint: acceptedMint, // example: USDC
        eventMint: eventMintPublicKey, // sponsorship token
        treasuryVault: treasuryVaultPublicKey,
        gainVault: gainVaultPdaPublicKey,
        authority: publicKey, // event organizer
      })
      .rpc();

    console.log("TxID: ", tx);

    const eventAccount = await program.account.event.fetch(eventPublicKey);
    console.log("Event info: ", eventAccount);
  } catch (e) {
    console.log("EL ERROR: ", e);
  }
};

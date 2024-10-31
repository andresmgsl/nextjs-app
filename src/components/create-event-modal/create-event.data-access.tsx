import { useWallet } from "@solana/wallet-adapter-react";
import { acceptedMint, useEventManagerProgram } from "@/utils/solana";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";

export function useCreateEvent(): {
  createEvent: (name: string, price: number) => Promise<void>;
} | undefined {
  // get connection y wallet
  const { publicKey } = useWallet();

  // get program type
  const program = useEventManagerProgram();
  // define a eventID based on timestamp
  const eventId = Date.now().toString();

  if (!publicKey) return;

  // find event account PDA
  const [eventPublicKey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(eventId, "utf-8"),
      Buffer.from("event", "utf-8"),
      publicKey.toBuffer(),
    ],
    program.programId
  );

  // find event mint account PDA
  const [eventMint] = PublicKey.findProgramAddressSync(
    [Buffer.from("event_mint", "utf-8"), eventPublicKey.toBuffer()],
    program.programId
  );

  // find treasury vault account PDA
  const [treasuryVault] = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury_vault", "utf-8"), eventPublicKey.toBuffer()],
    program.programId
  );

  // find gain vault account PDA
  const [gainVault] = PublicKey.findProgramAddressSync(
    [Buffer.from("gain_vault", "utf-8"), eventPublicKey.toBuffer()],
    program.programId
  );

  const createEvent = async (name: string, price: number) => {
    if (!publicKey) return;
    try {
      const tx = await program.methods
        .createEvent(eventId, name, new BN(price))
        .accounts({
          event: eventPublicKey,
          acceptedMint: acceptedMint, // example: USDC
          eventMint: eventMint, // sponsorship token
          treasuryVault: treasuryVault,
          gainVault: gainVault,
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

  return {createEvent};
}

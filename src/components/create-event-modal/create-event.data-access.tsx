import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { acceptedMint, getEventManagerProgram } from "@/utils/solana";
import { EventFormInputs } from "./create-event.ui";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";

export function useCreateEvent() {
  // get connection y wallet
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // get program type
  const program = getEventManagerProgram();
  // define a eventID based on timestamp
  const eventId = Date.now().toString();

  if (!publicKey) return;

  const getProgramAccount = connection.getParsedAccountInfo(program.programId);

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
    [
      Buffer.from("event_mint", "utf-8"),
      eventPublicKey.toBuffer(),
    ],
    program.programId
  );

  // find treasury vault account PDA
  const [treasuryVault] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("treasury_vault", "utf-8"),
      eventPublicKey.toBuffer(),
    ],
    program.programId
  );

  // find gain vault account PDA
  const [gainVault] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("gain_vault", "utf-8"),
      eventPublicKey.toBuffer(),
    ],
    program.programId
  );

  return {
    program,
    publicKey,
    getProgramAccount,
    eventPublicKey,
    eventMint,
    treasuryVault,
    gainVault,
    eventId,
  };
}

export const handleCreateEvent = async (formData: EventFormInputs, eventProgramData: any) => {    
  if (!eventProgramData) return;

  const {
    program,
    publicKey,
    eventPublicKey,
    eventMint,
    treasuryVault,
    gainVault,
    eventId
  } = eventProgramData;

  try {
    const tx = await program.methods
      .createEvent(eventId,formData.name, new BN(formData.price))
      .accounts({
        event: eventPublicKey,
        acceptedMint: acceptedMint, // example: USDC
        eventMint: eventMint, // sponsorship token
        treasuryVault: treasuryVault,
        gainVault: gainVault,
        authority: publicKey, // event organizer
      })
      .rpc();

      console.log('TxID: ', tx);

      const eventAccount = await program.account.event.fetch(eventPublicKey);
      console.log("Event info: ", eventAccount);

  } catch(e) {
    console.log("EL ERROR: ", e);
  }

};

import * as anchor from "@coral-xyz/anchor";
import EventManagerIDL from "../../utils/idl-event-manager.json";
import type { EventManager } from "../../utils/idl-event-manager";
import { BN } from "bn.js";
import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export const acceptedMint = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

export function EventManagerProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
  setProvider(provider);

  const program = getEventManagerProgram(provider);

  // find event account PDA
  const [eventPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("event", "utf-8"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  // find event mint account PDA
  const [eventMint] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("event_mint", "utf-8"), eventPublicKey.toBuffer()],
    program.programId
  );

  // find treasury vault account PDA
  const [treasuryVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("treasury_vault", "utf-8"), eventPublicKey.toBuffer()],
    program.programId
  );

  // find gain vault account PDA
  const [gainVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("gain_vault", "utf-8"), eventPublicKey.toBuffer()],
    program.programId
  );

  const name: string = "my_event";
  const ticketPrice = new BN(2); // 2 Accepted mint (USDC)

  return {
    program,
    provider,
    eventPublicKey,
    eventMint,
    treasuryVault,
    gainVault,
    name,
    ticketPrice,
  };
}

export const EVENT_MANAGER_PROGRAM_ID = new PublicKey(EventManagerIDL.address);

export function getEventManagerProgram(provider: AnchorProvider) {
  return new Program(EventManagerIDL as EventManager, provider);
}

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
  });
}

export function useEventManagerProgram() {
  const { connection } = useConnection();
  console.log(connection.rpcEndpoint);
  const provider = useAnchorProvider();
  const program = getEventManagerProgram(provider);
  const programId = EVENT_MANAGER_PROGRAM_ID;
  const eventId = Date.now().toString();

  if (!provider.wallet.publicKey) return;

  const getProgramAccount = connection.getParsedAccountInfo(programId);

  // find event account PDA
  const [eventPublicKey] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(eventId, "utf-8"),
      Buffer.from("event", "utf-8"),
      provider.wallet.publicKey.toBuffer(),
    ],
    program.programId
  );

  // find event mint account PDA
  const [eventMint] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("event_mint", "utf-8"),
      Buffer.from(eventId, "utf-8"),
      eventPublicKey.toBuffer(),
    ],
    program.programId
  );

  // find treasury vault account PDA
  const [treasuryVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("treasury_vault", "utf-8"),
      Buffer.from(eventId, "utf-8"),
      eventPublicKey.toBuffer(),
    ],
    program.programId
  );

  // find gain vault account PDA
  const [gainVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("gain_vault", "utf-8"),
      Buffer.from(eventId, "utf-8"),
      eventPublicKey.toBuffer(),
    ],
    program.programId
  );

  return {
    program,
    provider,
    programId,
    getProgramAccount,
    eventPublicKey,
    eventMint,
    treasuryVault,
    gainVault,
    eventId,
  };
}

import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { AnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { EventManager } from "./idl-event-manager";
import EventManagerIDL from "./idl-event-manager.json";

// USDC Devnet
//export const acceptedMint = new PublicKey(
//  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
//);

// Token de prueba
export const acceptedMint = new PublicKey(
    "4EkFJjbLuR7owjVFPcMKbt5XD2KUgZ8crPr1P5cJKNx1"
);

const EVENT_MANAGER_PROGRAM_ID = new PublicKey(EventManagerIDL.address);

export function getEventManagerProgramId() {
    return EVENT_MANAGER_PROGRAM_ID
}

export function getEventManagerProgram() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider =  new AnchorProvider(connection, wallet as AnchorWallet, {
        commitment: "confirmed",
    });
    return new Program(EventManagerIDL as EventManager, provider);
}

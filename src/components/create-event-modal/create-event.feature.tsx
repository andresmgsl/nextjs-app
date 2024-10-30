import { useState } from 'react';
import CreateEventModal, { EventFormInputs } from './create-event.ui';
import { acceptedMint, useEventManagerProgram } from './create-event.data-access';
import { BN } from 'bn.js';

export function CreateEventFeature() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const data = useEventManagerProgram();

  const handleCreateEvent = async (formData: EventFormInputs) => {
    setLoading(true);
    console.log(formData.name, formData.price);
    
    if (!data) return;

    const {
      program,
      provider,
      eventPublicKey,
      eventMint,
      treasuryVault,
      gainVault,
      eventId
    } = data;

    console.log("Just a test 420", program.programId.toBase58(), eventId);
    const tx = await program.methods
      .createEvent(eventId,formData.name, new BN(formData.price))
      .accounts({
        event: eventPublicKey,
        acceptedMint: acceptedMint, // example: USDC
        eventMint: eventMint, // sponsorship token
        treasuryVault: treasuryVault,
        gainVault: gainVault,
        authority: provider.wallet.publicKey, // event organizer
      })
      .rpc();

    console.log(tx);
    // show new event info
    const eventAccount = await program.account.event.fetch(eventPublicKey);
    console.log("Event info: ", eventAccount);


    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-300 w-40 text-black mt-5 font-semibold px-4 py-1 rounded hover:text-white hover:bg-indigo-400"
      >
        Crear Evento
      </button>

      <CreateEventModal
        isOpen={isModalOpen}
        loading={loading}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
            handleCreateEvent(data);
            setIsModalOpen(false);
        }}
      />
    </>
  );
};
import { useState } from 'react';
import CreateEventModal from './create-event.ui';
import { handleCreateEvent, useCreateEvent } from './create-event.data-access';

export function CreateEventFeature() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const createEventData = useCreateEvent();

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
        onSubmit={(formData) => {
            setLoading(true);
            handleCreateEvent(formData, createEventData);
            setLoading(false);
            setIsModalOpen(false);
        }}
      />
    </>
  );
};
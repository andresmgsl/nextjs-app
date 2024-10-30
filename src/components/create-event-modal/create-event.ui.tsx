import { useForm, SubmitHandler } from "react-hook-form";

export interface EventFormInputs {
  name: string;
  price: number;
}

export default function CreateEventModal({
  isOpen,
  loading,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data:EventFormInputs) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormInputs>({
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  const handleFormSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    try {
      console.log("Creating event:", data);
      onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="relative top-20 mx-auto max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Event Name</label>
            <input
              {...register("name", {
                required: "Event name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name must be less than 50 characters",
                },
              })}
              type="text"
              className={`w-full rounded-md border p-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter event name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Price (SOL)</label>
            <input
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price must be positive",
                },
                max: {
                  value: 1000000,
                  message: "Price is too high",
                },
                valueAsNumber: true,
              })}
              type="number"
              step="0.01"
              className={`w-full rounded-md border p-2 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

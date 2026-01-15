interface SaveCancelButtonsProps {
  hasChanges: boolean;
  changeCount: number;
  onSave: () => void;
  onCancel: () => void;
}

export const SaveCancelButtons = ({ hasChanges, changeCount, onSave, onCancel }: SaveCancelButtonsProps) => {
  if (!hasChanges) {
    return null;
  }

  // Show count only if more than 1 change
  const saveButtonText = changeCount > 1 ? `SAVE (${changeCount})` : 'SAVE';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-[1800px] mx-auto px-6 py-4 flex justify-end items-center gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
        >
          CANCEL CHANGES
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 text-sm font-semibold text-white bg-[#2A3170] hover:bg-[#1a2040] rounded transition-colors"
        >
          {saveButtonText}
        </button>
      </div>
    </div>
  );
};






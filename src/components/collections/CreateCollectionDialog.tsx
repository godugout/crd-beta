
import React from 'react';

export interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCollectionDialog: React.FC<CreateCollectionDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create New Collection</h2>
        <p>This is a stub component for the CreateCollectionDialog.</p>
        <div className="mt-6 flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-200 rounded mr-2"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => onOpenChange(false)}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionDialog;

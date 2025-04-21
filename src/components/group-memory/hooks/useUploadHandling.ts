import { GroupUploadType } from '@/lib/types';

export type { GroupUploadType };

export interface UploadTypeSelectorProps {
  uploadType: GroupUploadType;
  onChange: (value: GroupUploadType) => void;
}

export interface GroupImageUploaderProps {
  onImageSelect: (files: File[]) => void;
  onComplete?: (cardIds: string[]) => void;
  className?: string;
}

export const useUploadHandling = () => {
  // Implementation would go here
  return {
    handleFileUpload: (files: File[]) => {
      console.log('Files selected:', files);
      // Processing logic would go here
      return ['sample-id-1', 'sample-id-2'];
    },
    isUploading: false
  };
};

export default useUploadHandling;

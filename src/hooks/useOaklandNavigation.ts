
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useOaklandNavigation = () => {
  const navigate = useNavigate();

  const goToMemories = () => {
    navigate('/teams/oakland-athletics/memories');
  };

  const goToCreateMemory = () => {
    navigate('/teams/oakland-athletics/create');
  };

  const goToMemoryWithRefresh = () => {
    navigate('/teams/oakland-athletics/memories?refresh=true');
  };

  const handleMemoryCreated = (memoryId?: string) => {
    toast.success('Memory created successfully!');
    // Navigate back to memories with refresh flag
    goToMemoryWithRefresh();
  };

  const handleMemoryError = (error: string) => {
    toast.error(`Failed to create memory: ${error}`);
  };

  return {
    goToMemories,
    goToCreateMemory,
    goToMemoryWithRefresh,
    handleMemoryCreated,
    handleMemoryError
  };
};

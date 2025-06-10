
import { useState, useEffect } from 'react';
import { jumbotronOperations } from '@/repositories/oaklandRepository';
import { JumbotronContent } from '@/lib/types/oaklandTypes';
import { useToast } from '@/hooks/use-toast';

export const useJumbotronContent = () => {
  const [activeMessages, setActiveMessages] = useState<JumbotronContent[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActiveMessages = async () => {
    try {
      setLoading(true);
      const messages = await jumbotronOperations.getActive();
      setActiveMessages(messages);
    } catch (err) {
      console.error('Error fetching jumbotron messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const getMessagesByCategory = async (category: string) => {
    try {
      const messages = await jumbotronOperations.getByCategory(category);
      return messages;
    } catch (err) {
      console.error('Error fetching messages by category:', err);
      return [];
    }
  };

  const createMessage = async (messageData: Omit<JumbotronContent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newMessage = await jumbotronOperations.create({
        ...messageData,
        moderation_status: 'pending' // All user-created messages need moderation
      });
      
      toast({
        title: "Message Submitted!",
        description: "Your jumbotron message is pending moderation and will appear soon.",
      });
      
      return newMessage;
    } catch (err) {
      console.error('Error creating jumbotron message:', err);
      toast({
        title: "Error",
        description: "Failed to submit message. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const voteForMessage = async (messageId: string) => {
    try {
      await jumbotronOperations.vote(messageId);
      
      // Update local state
      setActiveMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, vote_count: msg.vote_count + 1 }
          : msg
      ));
      
      toast({
        title: "Vote Counted!",
        description: "Thanks for supporting this message!",
      });
    } catch (err) {
      console.error('Error voting for message:', err);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Auto-rotate through messages
  useEffect(() => {
    if (activeMessages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % activeMessages.length);
      }, 5000); // Change message every 5 seconds

      return () => clearInterval(interval);
    }
  }, [activeMessages.length]);

  useEffect(() => {
    fetchActiveMessages();
    
    // Refresh messages every 30 seconds for live updates
    const interval = setInterval(fetchActiveMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = activeMessages[currentMessageIndex];

  return {
    activeMessages,
    currentMessage,
    currentMessageIndex,
    loading,
    error,
    getMessagesByCategory,
    createMessage,
    voteForMessage,
    refetch: fetchActiveMessages,
    setCurrentMessageIndex
  };
};


import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from 'lucide-react';

interface SaveCombinationProps {
  onSave: (name: string) => void;
}

const SaveCombination = ({ onSave }: SaveCombinationProps) => {
  const [combinationName, setCombinationName] = useState("");
  
  const handleSaveCombination = () => {
    if (combinationName.trim()) {
      onSave(combinationName.trim());
      setCombinationName("");
    }
  };

  return (
    <div className="pt-2 mt-2 border-t border-gray-100">
      <Label htmlFor="combination-name" className="text-xs mb-2 flex items-center gap-1">
        <BookmarkPlus className="h-3 w-3" /> Save Current Combination
      </Label>
      <div className="flex gap-2 mt-1">
        <Input
          id="combination-name"
          type="text"
          value={combinationName}
          onChange={(e) => setCombinationName(e.target.value)}
          placeholder="Combination name"
          className="h-8 text-xs"
        />
        <Button 
          onClick={handleSaveCombination}
          disabled={!combinationName.trim()}
          size="sm"
          className="h-8 text-xs px-2 py-1"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SaveCombination;

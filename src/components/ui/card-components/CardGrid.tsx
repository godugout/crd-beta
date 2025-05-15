import React, { useState, useCallback } from 'react';
import { Card as CardType } from '@/lib/types/cardTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CardGridProps {
  cards: CardType[];
  onCardSelect?: (card: CardType) => void;
  onSearch?: (searchTerm: string) => void;
  onSort?: (sortBy: string) => void;
  isLoading?: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  onCardSelect, 
  onSearch, 
  onSort, 
  isLoading 
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch?.(term);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    onSort?.(sortValue);
  };

  // Find the code that accesses the .id property on an unknown type
  // and replace it with proper type checking
  const handleCardSelection = (card: any) => {
    if (card && typeof card === 'object' && 'id' in card) {
      setSelectedCardId(card.id);
      onCardSelect?.(card);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="search">Search:</Label>
          <Input 
            type="search" 
            id="search" 
            placeholder="Search cards..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="sort">Sort by:</Label>
          <select 
            id="sort" 
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">None</option>
            <option value="title">Title</option>
            <option value="createdAt">Date Created</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <p>Loading cards...</p>
      ) : (
        <ScrollArea className="rounded-md border">
          <Table>
            <TableCaption>A list of your digital trading cards.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id} onClick={() => handleCardSelection(card)} className={`cursor-pointer ${selectedCardId === card.id ? 'bg-secondary' : ''}`}>
                  <TableCell className="font-medium">{card.id}</TableCell>
                  <TableCell>{card.title}</TableCell>
                  <TableCell>{card.description}</TableCell>
                  <TableCell>{card.createdAt}</TableCell>
                </TableRow>
              ))}
              {cards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No cards found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
};

export default CardGrid;

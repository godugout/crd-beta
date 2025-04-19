import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCards } from '@/context/CardContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Fix for toast usage - using toast correctly
const handleError = () => {
  toast.error('Failed to activate AR mode');
};

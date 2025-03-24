
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FolderOpen, ChevronRight, Save, Trash2, ArrowLeft } from 'lucide-react';
import { useCards } from '@/context/CardContext';
import { toast } from 'sonner';
import { Collection } from '@/lib/types';

const CollectionForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined && id !== 'new';
  const navigate = useNavigate();
  const { collections, addCollection, updateCollection, deleteCollection } = useCards();
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Load collection data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const collection = collections.find(c => c.id === id);
      if (collection) {
        setFormData({
          name: collection.name,
          description: collection.description || ''
        });
      } else {
        toast.error('Collection not found');
        navigate('/collections');
      }
    }
  }, [isEditMode, id, collections, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditMode && id) {
        // Update existing collection
        await updateCollection(id, {
          name: formData.name,
          description: formData.description
        });
        toast.success('Collection updated successfully');
      } else {
        // Create new collection
        const newCollection = await addCollection({
          name: formData.name,
          description: formData.description
        });
        
        if (newCollection) {
          toast.success('Collection created successfully');
        }
      }
      
      // Navigate back to collections list
      navigate('/collections');
    } catch (error) {
      console.error('Collection form error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!isEditMode || !id) return;
    
    if (!window.confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteCollection(id);
      toast.success('Collection deleted successfully');
      navigate('/collections');
    } catch (error) {
      console.error('Delete collection error:', error);
      toast.error('An error occurred while deleting the collection.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto max-w-6xl px-4 pt-16 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 py-4 mt-4">
          <a href="/" className="hover:text-cardshow-blue">Home</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <a href="/collections" className="hover:text-cardshow-blue">Collections</a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-cardshow-dark font-medium">
            {isEditMode ? 'Edit Collection' : 'New Collection'}
          </span>
        </div>
        
        <div className="py-6">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="h-6 w-6 text-cardshow-blue" />
            <h1 className="text-3xl font-bold text-cardshow-dark">
              {isEditMode ? 'Edit Collection' : 'Create New Collection'}
            </h1>
          </div>
          <p className="text-cardshow-slate">
            {isEditMode 
              ? 'Update collection details' 
              : 'Create a new collection to organize your cards'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-cardshow-dark mb-2">
                  Collection Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter collection name"
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-cardshow-dark mb-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter collection description (optional)"
                  rows={4}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/collections')}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                
                <div className="flex space-x-3">
                  {isEditMode && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting || isSubmitting}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Collection'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CollectionForm;

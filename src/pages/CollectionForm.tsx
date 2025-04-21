import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useCards } from '@/context/CardContext';
import PageLayout from '@/components/navigation/PageLayout';

// Define the form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().optional(),
});

const CollectionForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addCollection, updateCollection, getCollectionById } = useCards();
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize form values
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
  });

  // Load collection data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const collection = getCollectionById(id);
      if (collection) {
        setFormValues({
          title: collection.title,
          description: collection.description || '',
        });
      }
    }
  }, [id, getCollectionById]);

  // Define the form using react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formValues.title,
      description: formValues.description,
    },
    mode: 'onChange',
  });

  // Update form values when they change
  useEffect(() => {
    form.reset({
      title: formValues.title,
      description: formValues.description,
    });
  }, [formValues, form.reset]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const newCollection = await addCollection({
        title: formValues.title,
        description: formValues.description,
      });
      
      toast({
        title: 'Collection created successfully!',
        description: 'You will be redirected to the collection details page.',
      });
      
      navigate(`/collections/${newCollection.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error creating collection',
        description: 'Something went wrong. Please try again.',
      });
    }
  };
  
  return (
    <PageLayout title={isEditMode ? "Edit Collection" : "Create Collection"} description={isEditMode ? "Edit your collection details" : "Create a new collection to organize your cards."}>
      <div className="container mx-auto max-w-3xl p-4">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Collection" {...field} onChange={(e) => setFormValues({...formValues, title: e.target.value})} value={formValues.title} />
                  </FormControl>
                  <FormDescription>
                    This is the title of your collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of my collection"
                      className="resize-none"
                      {...field}
                      onChange={(e) => setFormValues({...formValues, description: e.target.value})}
                      value={formValues.description}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your collection for others to see.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default CollectionForm;

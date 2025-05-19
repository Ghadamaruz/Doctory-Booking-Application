import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Doctor } from '@/types/doctor';
import useDebounce from './useDebounce';

interface SearchOptions {
  specialty?: string;
  sortByRating?: boolean;
  limit?: number;
}

/**
 * Custom hook for searching doctors with sorting by rating
 */
export default function useSearchDoctors(initialQuery: string = '', options: SearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { 
    specialty,
    sortByRating = true, // Default to sorting by rating
    limit = 20
  } = options;

  // Example mock doctors for testing when Supabase doesn't return results
  const mockDoctors: Doctor[] = [
    {
      id: "1",
      first_name: "John",
      last_name: "Smith",
      specialty: "General Physician",
      experience: "10+ years",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1537368910025-70a0788ddc2a?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: "2",
      first_name: "Emily",
      last_name: "Johnson",
      specialty: "Pediatrician",
      experience: "8 years",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      id: "3",
      first_name: "David",
      last_name: "Williams",
      specialty: "Cardiologist",
      experience: "15 years",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  // Fetch doctors when search query changes
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!debouncedSearchQuery && !specialty) {
        // If no search query and no specialty filter, return all doctors sorted by rating
        try {
          setIsLoading(true);
          setError(null);

          let query = supabase
            .from('profiles')
            .select('*')
            .eq('role', 'doctor');

          if (sortByRating) {
            query = query.order('rating', { ascending: false });
          }

          query = query.limit(limit);

          const { data, error } = await query;

          if (error) {
            console.error('Error fetching doctors:', error);
            setError('Failed to fetch doctors');
            // Use mock data when there's an error
            setDoctors(mockDoctors);
            return;
          }

          if (data && data.length > 0) {
            setDoctors(data as Doctor[]);
          } else {
            // Use mock data when no real data is available
            setDoctors(mockDoctors);
          }
        } catch (err) {
          console.error('Exception fetching doctors:', err);
          setError('An unexpected error occurred');
          setDoctors(mockDoctors);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Build the search query
        let query = supabase
          .from('profiles')
          .select('*')
          .eq('role', 'doctor');

        // Add search filters if there's a query
        if (debouncedSearchQuery) {
          query = query.or(
            `first_name.ilike.%${debouncedSearchQuery}%,` +
            `last_name.ilike.%${debouncedSearchQuery}%,` +
            `specialty.ilike.%${debouncedSearchQuery}%`
          );
        }

        // Add specialty filter if specified
        if (specialty) {
          query = query.ilike('specialty', `%${specialty}%`);
        }

        // Add sorting
        if (sortByRating) {
          query = query.order('rating', { ascending: false });
        }

        // Add limit
        query = query.limit(limit);

        const { data, error } = await query;

        if (error) {
          console.error('Error searching doctors:', error);
          setError('Failed to search doctors');
          // Use mock data when there's an error
          setDoctors(mockDoctors);
          return;
        }

        if (data && data.length > 0) {
          setDoctors(data as Doctor[]);
        } else {
          // Use filtered mock data when no results
          const filteredMocks = mockDoctors.filter(doc => {
            const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
            const searchLower = debouncedSearchQuery.toLowerCase();
            
            return (
              fullName.includes(searchLower) ||
              (doc.specialty && doc.specialty.toLowerCase().includes(searchLower))
            );
          });
          
          setDoctors(filteredMocks);
        }
      } catch (err) {
        console.error('Exception searching doctors:', err);
        setError('An unexpected error occurred');
        setDoctors(mockDoctors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [debouncedSearchQuery, specialty, sortByRating, limit]);

  return {
    searchQuery,
    setSearchQuery,
    doctors,
    isLoading,
    error,
  };
} 
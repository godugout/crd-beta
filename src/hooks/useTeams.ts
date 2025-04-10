
// hooks/useTeams.ts
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface Team {
  id: string
  name: string
  abbreviation: string
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  stadiumInfo: Record<string, any>
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('name')
        if (error) throw error
        setTeams(data || [])
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  const getTeamById = (id: string) => teams.find(t => t.id === id) || null

  return { teams, loading, error, getTeamById }
}


// hooks/useUser.ts
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export interface User {
  id: string
  username: string
  email: string
  profileImage?: string
  bio?: string
  createdAt: string
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session) {
          setUser(null)
          setLoading(false)
          return
        }
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (error) throw error
        setUser(data)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        supabase.from('users').select('*').eq('id', session.user.id).single()
          .then(({ data }) => setUser(data))
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })
    return () => { subscription.unsubscribe() }
  }, [])

  return { user, loading, error }
}

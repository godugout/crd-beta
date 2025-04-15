
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

// Handle CORS preflight requests
async function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

async function fetchInstagramPosts(username: string, accessToken: string, limit = 33): Promise<InstagramMedia[]> {
  try {
    // First get the user ID from the username
    const userResponse = await fetch(
      `https://graph.instagram.com/v12.0/${username}?fields=id,username&access_token=${accessToken}`
    );
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch Instagram user information');
    }
    
    const userData = await userResponse.json();
    const userId = userData.id;
    
    // Then fetch the media from the user ID
    const mediaResponse = await fetch(
      `https://graph.instagram.com/v12.0/${userId}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&limit=${limit}&access_token=${accessToken}`
    );
    
    if (!mediaResponse.ok) {
      throw new Error('Failed to fetch Instagram media');
    }
    
    const mediaData: InstagramResponse = await mediaResponse.json();
    return mediaData.data;
  } catch (error) {
    console.error('Instagram API error:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = await handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    const { username, url } = await req.json();
    
    // Extract username from URL if provided
    let instagramUsername = username;
    if (!instagramUsername && url) {
      // Parse username from URL (e.g., https://www.instagram.com/username/)
      const match = url.match(/instagram\.com\/([^\/\?]+)/);
      if (match && match[1]) {
        instagramUsername = match[1];
      }
    }
    
    if (!instagramUsername) {
      return new Response(
        JSON.stringify({ error: 'Instagram username or URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get the Instagram access token from environment variables
    const accessToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: 'Instagram access token not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const posts = await fetchInstagramPosts(instagramUsername, accessToken);
    
    return new Response(
      JSON.stringify({ posts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch Instagram posts' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})

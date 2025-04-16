
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Sample card data - optimized for Wikimedia Commons images
const commonsCards = [
  {
    title: "Mickey Mantle Rookie Card",
    description: "1952 Topps Mickey Mantle rookie card, one of the most valuable baseball cards ever produced.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/1952_Topps_Mickey_Mantle.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/1952_Topps_Mickey_Mantle.jpg",
    rarity: "legendary",
    tags: ["baseball", "vintage", "hall of fame", "yankees", "commons"],
    is_public: true,
    edition_size: 1,
    design_metadata: {
      cardStyle: {
        borderColor: "#D4AF37",
        backgroundColor: "#1f1f1f",
        effect: "vintage"
      },
      textStyle: {
        titleColor: "#F3F4F6",
        descriptionColor: "#D1D5DB",
        fontFamily: "serif"
      }
    }
  },
  {
    title: "Honus Wagner T206",
    description: "The T206 Honus Wagner is often referred to as the 'Holy Grail' of baseball cards and is the most valuable sports card in existence.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Honus_Wagner_baseball_card.jpg/440px-Honus_Wagner_baseball_card.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Honus_Wagner_baseball_card.jpg/440px-Honus_Wagner_baseball_card.jpg",
    rarity: "mythic",
    tags: ["baseball", "antique", "hall of fame", "pirates", "commons"],
    is_public: true,
    edition_size: 1,
    design_metadata: {
      cardStyle: {
        borderColor: "#8B4513",
        backgroundColor: "#18181b",
        effect: "antique"
      },
      textStyle: {
        titleColor: "#E5E7EB",
        descriptionColor: "#9CA3AF",
        fontFamily: "oldstyle"
      }
    }
  },
  {
    title: "Michael Jordan Rookie Card",
    description: "1986 Fleer Michael Jordan rookie card featuring the basketball legend in his Chicago Bulls uniform.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Michael_jordan_rookie_card.jpg/414px-Michael_jordan_rookie_card.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Michael_jordan_rookie_card.jpg/414px-Michael_jordan_rookie_card.jpg",
    rarity: "rare",
    tags: ["basketball", "nba", "hall of fame", "bulls", "commons"],
    is_public: true,
    edition_size: 10,
    design_metadata: {
      cardStyle: {
        borderColor: "#cc0000",
        backgroundColor: "#121212",
        effect: "glossy"
      },
      textStyle: {
        titleColor: "#F9FAFB",
        descriptionColor: "#D1D5DB",
        fontFamily: "sans-serif"
      }
    }
  },
  {
    title: "Wayne Gretzky Rookie Card",
    description: "1979 O-Pee-Chee Wayne Gretzky rookie card, featuring 'The Great One' in his Edmonton Oilers uniform.",
    image_url: "https://upload.wikimedia.org/wikipedia/en/2/26/Wayne_Gretzky_1979_rookie_card.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/en/2/26/Wayne_Gretzky_1979_rookie_card.jpg",
    rarity: "epic",
    tags: ["hockey", "nhl", "hall of fame", "oilers", "commons"],
    is_public: true,
    edition_size: 5,
    design_metadata: {
      cardStyle: {
        borderColor: "#0057b7",
        backgroundColor: "#111111",
        effect: "frosted"
      },
      textStyle: {
        titleColor: "#F3F4F6",
        descriptionColor: "#D1D5DB",
        fontFamily: "sans-serif"
      }
    }
  },
  {
    title: "Charizard 1st Edition",
    description: "1999 Pokémon Base Set 1st Edition Charizard holographic card, one of the most sought-after Pokémon cards.",
    image_url: "https://upload.wikimedia.org/wikipedia/en/1/1f/Pokémon_Charizard_art.png",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/en/1/1f/Pokémon_Charizard_art.png",
    rarity: "ultra rare",
    tags: ["pokemon", "tcg", "holographic", "fire", "commons"],
    is_public: true,
    edition_size: 3,
    design_metadata: {
      cardStyle: {
        borderColor: "#FFC300",
        backgroundColor: "#121212",
        effect: "holographic"
      },
      textStyle: {
        titleColor: "#FF5733",
        descriptionColor: "#D1D5DB",
        fontFamily: "fantasy"
      }
    }
  },
  {
    title: "Black Lotus Alpha",
    description: "Magic: The Gathering Alpha Black Lotus card, considered the most valuable non-sports trading card in the world.",
    image_url: "https://upload.wikimedia.org/wikipedia/en/7/70/Black_Lotus_%28Magic_The_Gathering%29_by_Christopher_Rush.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/en/7/70/Black_Lotus_%28Magic_The_Gathering%29_by_Christopher_Rush.jpg",
    rarity: "mythic rare",
    tags: ["magic the gathering", "mtg", "power nine", "alpha", "commons"],
    is_public: true,
    edition_size: 2,
    design_metadata: {
      cardStyle: {
        borderColor: "#000000",
        backgroundColor: "#121212",
        effect: "aged"
      },
      textStyle: {
        titleColor: "#F3F4F6",
        descriptionColor: "#D1D5DB",
        fontFamily: "serif"
      }
    }
  },
  {
    title: "Babe Ruth Game-Used Bat Card",
    description: "Card featuring an authentic piece of a game-used bat from baseball legend Babe Ruth.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Babe_Ruth2.jpg/440px-Babe_Ruth2.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Babe_Ruth2.jpg/440px-Babe_Ruth2.jpg",
    rarity: "rare",
    tags: ["baseball", "memorabilia", "game used", "yankees", "commons"],
    is_public: true,
    edition_size: 7,
    design_metadata: {
      cardStyle: {
        borderColor: "#C0C0C0",
        backgroundColor: "#1a1a1a",
        effect: "embossed"
      },
      textStyle: {
        titleColor: "#F9FAFB",
        descriptionColor: "#D1D5DB",
        fontFamily: "serif"
      }
    }
  },
  {
    title: "Kobe Bryant Autographed Card",
    description: "Autographed rookie card of NBA legend Kobe Bryant featuring his authentic signature.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Kobe_Bryant_8.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Kobe_Bryant_8.jpg",
    rarity: "epic",
    tags: ["basketball", "nba", "autograph", "lakers", "commons"],
    is_public: true,
    edition_size: 8,
    design_metadata: {
      cardStyle: {
        borderColor: "#552583",
        backgroundColor: "#0c0c0c",
        effect: "glossy"
      },
      textStyle: {
        titleColor: "#FDB927",
        descriptionColor: "#D1D5DB",
        fontFamily: "sans-serif"
      }
    }
  },
  {
    title: "Shoeless Joe Jackson Card",
    description: "Rare vintage card of Shoeless Joe Jackson, infamous for his role in the 1919 Black Sox scandal.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Joe_Jackson.jpg/439px-Joe_Jackson.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Joe_Jackson.jpg/439px-Joe_Jackson.jpg",
    rarity: "legendary",
    tags: ["baseball", "vintage", "white sox", "scandal", "commons"],
    is_public: true,
    edition_size: 3,
    design_metadata: {
      cardStyle: {
        borderColor: "#8B4513",
        backgroundColor: "#0a0a0a",
        effect: "vintage"
      },
      textStyle: {
        titleColor: "#F3F4F6",
        descriptionColor: "#D1D5DB",
        fontFamily: "serif"
      }
    }
  },
  {
    title: "LeBron James Rookie Card",
    description: "2003-04 Upper Deck LeBron James rookie card from his first NBA season with the Cleveland Cavaliers.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/LeBron_James_crop.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/LeBron_James_crop.jpg",
    rarity: "rare",
    tags: ["basketball", "nba", "cavaliers", "rookie", "commons"],
    is_public: true,
    edition_size: 10,
    design_metadata: {
      cardStyle: {
        borderColor: "#860038",
        backgroundColor: "#111111",
        effect: "refractor"
      },
      textStyle: {
        titleColor: "#FDBB30",
        descriptionColor: "#D1D5DB",
        fontFamily: "sans-serif"
      }
    }
  }
];

// Create a dedicated collection for Wikimedia Commons images
const commonsCollection = {
  title: "Commons Cards",
  description: "A collection of public domain images from Wikimedia Commons for testing and display purposes.",
  visibility: "public",
  allow_comments: true,
  cover_image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/1952_Topps_Mickey_Mantle.jpg",
  design_metadata: {
    theme: "dark",
    primaryColor: "#6D28D9",
    secondaryColor: "#9333EA",
    backgroundTexture: "carbon",
    glassmorphism: true
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the project details
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://wxlwhqlbxyuyujhqeyur.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log("Starting to populate database with Commons Cards collection...");

    // Check if the Commons Cards collection already exists
    const { data: existingCollections, error: checkError } = await supabase
      .from('collections')
      .select('id')
      .eq('title', 'Commons Cards')
      .limit(1);
      
    let collectionId;
    let isNewCollection = false;
    
    if (checkError) {
      console.error("Error checking for existing collection:", checkError);
      return new Response(JSON.stringify({ error: checkError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    // If the collection exists, use it; otherwise create a new one
    if (existingCollections && existingCollections.length > 0) {
      collectionId = existingCollections[0].id;
      console.log(`Using existing Commons Cards collection: ${collectionId}`);
      
      // Update the existing collection with latest metadata
      const { error: updateError } = await supabase
        .from('collections')
        .update({
          description: commonsCollection.description,
          cover_image_url: commonsCollection.cover_image_url,
          design_metadata: commonsCollection.design_metadata,
          visibility: commonsCollection.visibility,
          allow_comments: commonsCollection.allow_comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', collectionId);
        
      if (updateError) {
        console.error("Error updating collection:", updateError);
      }
    } else {
      // Create a new Commons Cards collection
      const { data: newCollection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          ...commonsCollection,
          owner_id: req.headers.get('authorization')?.split(' ')[1] || '00000000-0000-0000-0000-000000000000'
        })
        .select()
        .single();

      if (collectionError) {
        console.error("Error creating collection:", collectionError);
        return new Response(JSON.stringify({ error: collectionError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      collectionId = newCollection.id;
      isNewCollection = true;
      console.log(`Created new Commons Cards collection: ${collectionId}`);
    }
    
    // Clear existing cards in this collection if we're updating
    if (!isNewCollection) {
      console.log("Removing existing cards from Commons Cards collection...");
      const { error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('collection_id', collectionId);
      
      if (deleteError) {
        console.error("Error deleting existing cards:", deleteError);
        // Continue anyway, we'll just add more cards
      }
    }

    // Add the new cards to the collection
    const cardPromises = commonsCards.map(card => {
      const cardData = {
        ...card,
        collection_id: collectionId,
        creator_id: req.headers.get('authorization')?.split(' ')[1] || '00000000-0000-0000-0000-000000000000',
        user_id: req.headers.get('authorization')?.split(' ')[1] || '00000000-0000-0000-0000-000000000000'
      };
      
      return supabase
        .from('cards')
        .insert(cardData)
        .select();
    });

    const results = await Promise.all(cardPromises);
    
    // Check for errors
    const errors = results.filter(result => result.error).map(result => result.error);
    if (errors.length > 0) {
      console.error("Errors inserting cards:", errors);
      return new Response(JSON.stringify({ errors }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const successCount = results.filter(result => result.data).length;
    console.log(`Successfully added ${successCount} cards to Commons Cards collection ${collectionId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: isNewCollection 
          ? `Created Commons Cards collection with ${successCount} cards` 
          : `Updated Commons Cards collection with ${successCount} new cards`,
        collectionId: collectionId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

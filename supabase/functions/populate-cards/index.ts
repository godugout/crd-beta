
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Sample card data
const sampleCards = [
  {
    title: "Mickey Mantle Rookie Card",
    description: "1952 Topps Mickey Mantle rookie card, one of the most valuable baseball cards ever produced.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/1952_Topps_Mickey_Mantle.jpg",
    thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/1952_Topps_Mickey_Mantle.jpg",
    rarity: "legendary",
    tags: ["baseball", "vintage", "hall of fame", "yankees"],
    is_public: true,
    edition_size: 1,
    design_metadata: {
      cardStyle: {
        borderColor: "#D4AF37",
        backgroundColor: "#f8f8ec",
        effect: "vintage"
      },
      textStyle: {
        titleColor: "#000000",
        descriptionColor: "#333333",
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
    tags: ["baseball", "antique", "hall of fame", "pirates"],
    is_public: true,
    edition_size: 1,
    design_metadata: {
      cardStyle: {
        borderColor: "#8B4513",
        backgroundColor: "#f9f0e0",
        effect: "antique"
      },
      textStyle: {
        titleColor: "#3c1f0e",
        descriptionColor: "#5a3d2b",
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
    tags: ["basketball", "nba", "hall of fame", "bulls"],
    is_public: true,
    edition_size: 10,
    design_metadata: {
      cardStyle: {
        borderColor: "#cc0000",
        backgroundColor: "#ffffff",
        effect: "glossy"
      },
      textStyle: {
        titleColor: "#000000",
        descriptionColor: "#333333",
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
    tags: ["hockey", "nhl", "hall of fame", "oilers"],
    is_public: true,
    edition_size: 5,
    design_metadata: {
      cardStyle: {
        borderColor: "#0057b7",
        backgroundColor: "#ffffff",
        effect: "frosted"
      },
      textStyle: {
        titleColor: "#000000",
        descriptionColor: "#333333",
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
    tags: ["pokemon", "tcg", "holographic", "fire"],
    is_public: true,
    edition_size: 3,
    design_metadata: {
      cardStyle: {
        borderColor: "#FFC300",
        backgroundColor: "#fffcf2",
        effect: "holographic"
      },
      textStyle: {
        titleColor: "#FF5733",
        descriptionColor: "#333333",
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
    tags: ["magic the gathering", "mtg", "power nine", "alpha"],
    is_public: true,
    edition_size: 2,
    design_metadata: {
      cardStyle: {
        borderColor: "#000000",
        backgroundColor: "#f5f1e6",
        effect: "aged"
      },
      textStyle: {
        titleColor: "#000000",
        descriptionColor: "#333333",
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
    tags: ["baseball", "memorabilia", "game used", "yankees"],
    is_public: true,
    edition_size: 7,
    design_metadata: {
      cardStyle: {
        borderColor: "#C0C0C0",
        backgroundColor: "#f8f8f8",
        effect: "embossed"
      },
      textStyle: {
        titleColor: "#000000",
        descriptionColor: "#333333",
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
    tags: ["basketball", "nba", "autograph", "lakers"],
    is_public: true,
    edition_size: 8,
    design_metadata: {
      cardStyle: {
        borderColor: "#552583",
        backgroundColor: "#ffffff",
        effect: "glossy"
      },
      textStyle: {
        titleColor: "#552583",
        descriptionColor: "#333333",
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
    tags: ["baseball", "vintage", "white sox", "scandal"],
    is_public: true,
    edition_size: 3,
    design_metadata: {
      cardStyle: {
        borderColor: "#8B4513",
        backgroundColor: "#f9f0e0",
        effect: "vintage"
      },
      textStyle: {
        titleColor: "#000000",
        descriptionColor: "#333333",
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
    tags: ["basketball", "nba", "cavaliers", "rookie"],
    is_public: true,
    edition_size: 10,
    design_metadata: {
      cardStyle: {
        borderColor: "#860038",
        backgroundColor: "#ffffff",
        effect: "refractor"
      },
      textStyle: {
        titleColor: "#860038",
        descriptionColor: "#333333",
        fontFamily: "sans-serif"
      }
    }
  }
];

// Create a collection to hold our cards
const collection = {
  title: "Historic Trading Cards",
  description: "A collection of some of the most iconic and valuable trading cards in sports and gaming history.",
  visibility: "public",
  allow_comments: true,
  cover_image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/1952_Topps_Mickey_Mantle.jpg",
  design_metadata: {
    theme: "vintage",
    primaryColor: "#8B4513",
    backgroundTexture: "paper"
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
    
    console.log("Starting to populate database with sample cards...");

    // First create a collection
    const { data: collectionData, error: collectionError } = await supabase
      .from('collections')
      .insert({
        ...collection,
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

    console.log(`Created collection: ${collectionData.id}`);

    // Then create the cards and associate them with the collection
    const cardPromises = sampleCards.map(card => {
      const cardData = {
        ...card,
        collection_id: collectionData.id,
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
    console.log(`Successfully added ${successCount} cards to collection ${collectionData.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Created collection "${collection.title}" with ${successCount} cards`,
        collectionId: collectionData.id,
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

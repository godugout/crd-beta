// Import necessary types
import { Card, CardMarketMetadata } from '@/lib/types/cardTypes';

// Sample card data for testing and development
export const cardData: Card[] = [
  {
    id: "1",
    title: "Oakland Roots 2023",
    description: "A tribute to the vibrant Oakland Roots soccer team",
    imageUrl: "/images/card-samples/oakland-roots-sample.jpg",
    thumbnailUrl: "/images/card-samples/oakland-roots-sample.jpg",
    tags: ["soccer", "oakland", "roots", "2023"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
    designMetadata: {
      cardStyle: {
        template: "gradient",
        effect: "none",
        borderRadius: "12px",
        borderColor: "#32CD32",
        backgroundColor: "#000000",
        frameWidth: 4,
        frameColor: "#32CD32",
        shadowColor: "rgba(0,0,0,0.5)"
      },
      textStyle: {
        titleColor: "#FFFFFF",
        titleAlignment: "center",
        titleWeight: "bold",
        descriptionColor: "#FFFFFF"
      },
      cardMetadata: {
        category: "sports",
        series: "2023",
        cardType: "team"
      },
      marketMetadata: {
        price: 75,
        currency: "USD",
        availableForSale: true,
        editionSize: 500,
        editionNumber: 123,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  },
  {
    id: "2",
    title: "Golden State Warriors 2017",
    description: "Celebrating the Warriors' championship season",
    imageUrl: "/images/card-samples/golden-state-warriors-sample.jpg",
    thumbnailUrl: "/images/card-samples/golden-state-warriors-sample.jpg",
    tags: ["basketball", "warriors", "championship", "2017"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-2",
    designMetadata: {
      cardStyle: {
        template: "metallic",
        effect: "shine",
        borderRadius: "8px",
        borderColor: "#FFD700",
        backgroundColor: "#006D5B",
        frameWidth: 3,
        frameColor: "#FFD700",
        shadowColor: "rgba(0,0,0,0.4)"
      },
      textStyle: {
        titleColor: "#FFFFFF",
        titleAlignment: "left",
        titleWeight: "bold",
        descriptionColor: "#FFFFFF"
      },
      cardMetadata: {
        category: "sports",
        series: "2017",
        cardType: "team"
      },
      marketMetadata: {
        price: 120,
        currency: "USD",
        availableForSale: true,
        editionSize: 250,
        editionNumber: 45,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  },
  {
    id: "3",
    title: "San Francisco Giants 2014",
    description: "Honoring the Giants' World Series victory",
    imageUrl: "/images/card-samples/san-francisco-giants-sample.jpg",
    thumbnailUrl: "/images/card-samples/san-francisco-giants-sample.jpg",
    tags: ["baseball", "giants", "world series", "2014"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-3",
    designMetadata: {
      cardStyle: {
        template: "vintage",
        effect: "sepia",
        borderRadius: "6px",
        borderColor: "#A52A2A",
        backgroundColor: "#F5F5DC",
        frameWidth: 2,
        frameColor: "#A52A2A",
        shadowColor: "rgba(0,0,0,0.3)"
      },
      textStyle: {
        titleColor: "#8B4513",
        titleAlignment: "right",
        titleWeight: "normal",
        descriptionColor: "#8B4513"
      },
      cardMetadata: {
        category: "sports",
        series: "2014",
        cardType: "team"
      },
      marketMetadata: {
        price: 90,
        currency: "USD",
        availableForSale: true,
        editionSize: 300,
        editionNumber: 78,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  }
];

// Update the marketMetadata objects to include the required properties
export const sampleCardData: Card[] = [
  {
    id: "card-1",
    title: "Mike Trout 2021",
    description: "Limited Edition Holographic Card",
    imageUrl: "/placeholder-card.png",
    thumbnailUrl: "/placeholder-card.png",
    tags: ["baseball", "angels", "holographic"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
    player: "Mike Trout",
    team: "Angels",
    year: "2021",
    effects: ["holographic"],
    designMetadata: {
      cardStyle: {
        template: "modern",
        effect: "holographic",
        borderRadius: "12px",
        borderColor: "#ff0000",
        backgroundColor: "#ffffff",
        frameWidth: 6,
        frameColor: "#ff0000",
        shadowColor: "rgba(0,0,0,0.3)"
      },
      textStyle: {
        titleColor: "#333333",
        titleAlignment: "center",
        titleWeight: "bold",
        descriptionColor: "#666666"
      },
      cardMetadata: {
        category: "sports",
        series: "2021",
        cardType: "player"
      },
      marketMetadata: {
        price: 150,
        currency: "USD",
        availableForSale: true,
        editionSize: 100,
        editionNumber: 42,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  },
  {
    id: "card-2",
    title: "LeBron James 2012",
    description: "Miami Heat Championship Card",
    imageUrl: "/placeholder-card.png",
    thumbnailUrl: "/placeholder-card.png",
    tags: ["basketball", "heat", "champion"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-2",
    player: "LeBron James",
    team: "Heat",
    year: "2012",
    effects: ["refractor"],
    designMetadata: {
      cardStyle: {
        template: "retro",
        effect: "refractor",
        borderRadius: "8px",
        borderColor: "#0000ff",
        backgroundColor: "#ffff00",
        frameWidth: 4,
        frameColor: "#0000ff",
        shadowColor: "rgba(0,0,0,0.3)"
      },
      textStyle: {
        titleColor: "#ffffff",
        titleAlignment: "center",
        titleWeight: "bold",
        descriptionColor: "#000000"
      },
      cardMetadata: {
        category: "sports",
        series: "2012",
        cardType: "player"
      },
      marketMetadata: {
        price: 200,
        currency: "USD",
        availableForSale: true,
        editionSize: 50,
        editionNumber: 12,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  },
  {
    id: "card-3",
    title: "Babe Ruth 1933",
    description: "New York Yankees Legend",
    imageUrl: "/placeholder-card.png",
    thumbnailUrl: "/placeholder-card.png",
    tags: ["baseball", "yankees", "legend"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-3",
    player: "Babe Ruth",
    team: "Yankees",
    year: "1933",
    effects: ["vintage"],
    designMetadata: {
      cardStyle: {
        template: "classic",
        effect: "vintage",
        borderRadius: "6px",
        borderColor: "#808080",
        backgroundColor: "#f0f0f0",
        frameWidth: 2,
        frameColor: "#808080",
        shadowColor: "rgba(0,0,0,0.3)"
      },
      textStyle: {
        titleColor: "#800000",
        titleAlignment: "center",
        titleWeight: "normal",
        descriptionColor: "#800000"
      },
      cardMetadata: {
        category: "sports",
        series: "1933",
        cardType: "player"
      },
      marketMetadata: {
        price: 500,
        currency: "USD",
        availableForSale: false,
        editionSize: 10,
        editionNumber: 1,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  }
];

export const teamData = [
  {
    id: "team-1",
    name: "Golden State Warriors",
    logoUrl: "/images/team-logos/warriors.png",
    description: "The Golden State Warriors are an American professional basketball team based in San Francisco.",
    ownerId: "user-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-2",
    name: "Los Angeles Lakers",
    logoUrl: "/images/team-logos/lakers.png",
    description: "The Los Angeles Lakers are an American professional basketball team based in Los Angeles.",
    ownerId: "user-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "team-3",
    name: "Boston Celtics",
    logoUrl: "/images/team-logos/celtics.png",
    description: "The Boston Celtics are an American professional basketball team based in Boston.",
    ownerId: "user-3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

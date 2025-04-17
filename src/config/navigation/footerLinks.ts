
interface FooterSection {
  title: string;
  links: { label: string; href: string; }[];
}

export const footerLinks = {
  quickLinks: [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Collections", path: "/collections" },
    { label: "Gallery", path: "/gallery" },
    { label: "Community", path: "/community" }
  ],
  features: [
    { label: "Card Designer", path: "/card-designer" },
    { label: "3D Viewer", path: "/3d-viewer" },
    { label: "AR Experience", path: "/ar-experience" },
    { label: "Deck Builder", path: "/decks" },
    { label: "Trade Center", path: "/trades" }
  ],
  legal: [
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Cookie Policy", path: "/cookies" },
    { label: "Community Guidelines", path: "/guidelines" }
  ]
};

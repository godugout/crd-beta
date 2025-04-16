
import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from '../GlobalNavbar';

interface DesktopNavLinksProps {
  links: NavLink[];
}

const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({ links }) => {
  return (
    <nav className="hidden md:flex flex-1 items-center justify-center">
      <ul className="flex space-x-6">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.href}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DesktopNavLinks;

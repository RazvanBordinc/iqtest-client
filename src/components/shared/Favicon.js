"use client";

import { useEffect } from 'react';

export default function Favicon() {
  useEffect(() => {
    // Create link elements for favicons
    const standardFavicon = document.createElement('link');
    standardFavicon.rel = 'icon';
    standardFavicon.href = '/favicon.ico';
    standardFavicon.type = 'image/x-icon';
    
    const shortcutFavicon = document.createElement('link');
    shortcutFavicon.rel = 'shortcut icon';
    shortcutFavicon.href = '/favicon.ico';
    shortcutFavicon.type = 'image/x-icon';
    
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/favicon.ico';
    
    // Add the links to the head
    document.head.appendChild(standardFavicon);
    document.head.appendChild(shortcutFavicon);
    document.head.appendChild(appleTouchIcon);
    
    // Cleanup function
    return () => {
      document.head.removeChild(standardFavicon);
      document.head.removeChild(shortcutFavicon);
      document.head.removeChild(appleTouchIcon);
    };
  }, []);
  
  return null;
}
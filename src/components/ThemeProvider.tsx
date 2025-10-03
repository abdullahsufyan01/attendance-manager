import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const primaryColor = useAppSelector((state) => state.settings.company.primaryColor);

  useEffect(() => {
    // Convert hex to HSL
    const hexToHSL = (hex: string) => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Convert hex to RGB
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      // Find max and min values
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }

      // Convert to degrees and percentages
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      const lightness = Math.round(l * 100);

      return `${h} ${s}% ${lightness}%`;
    };

    if (primaryColor) {
      const hslColor = hexToHSL(primaryColor);
      
      // Apply to CSS variables
      document.documentElement.style.setProperty('--primary', hslColor);
      
      // Also update sidebar primary color
      document.documentElement.style.setProperty('--sidebar-primary', hslColor);
      
      // Update chart colors
      document.documentElement.style.setProperty('--chart-1', hslColor);
    }
  }, [primaryColor]);

  return <>{children}</>;
};

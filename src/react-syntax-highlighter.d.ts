declare module 'react-syntax-highlighter' {
  import { ReactNode } from 'react';
  
  export const Prism: React.ComponentType<{
    children: ReactNode;
    style?: any;
    language?: string;
    customStyle?: React.CSSProperties;
  }>;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  export const tomorrow: any;
}
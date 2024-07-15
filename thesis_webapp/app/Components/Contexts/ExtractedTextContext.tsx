"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExtractedTextContextType {
  extractedText: {
    title: string;
    category: string;
    body: string;
  };
  setExtractedText: React.Dispatch<React.SetStateAction<{
    title: string;
    category: string;
    body: string;
  }>>;
}

const ExtractedTextContext = createContext<ExtractedTextContextType | undefined>(undefined);

export function useExtractedText() {
  const context = useContext(ExtractedTextContext);
  if (!context) {
    throw new Error('useExtractedText must be used within an ExtractedTextProvider');
  }
  return context;
}

export function ExtractedTextProvider({ children }: { children: ReactNode }) {
  const [extractedText, setExtractedText] = useState({
    title: '',
    category: '',
    body: '',
  });

  return (
    <ExtractedTextContext.Provider value={{ extractedText, setExtractedText }}>
      {children}
    </ExtractedTextContext.Provider>
  );
}

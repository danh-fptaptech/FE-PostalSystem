import React from 'react'

interface PostalCodeContextType {
  postalCodeFrom: string;
  postalCodeTo: string;
  totalWeight: number;
  totalPrice: number;
  setPostalCodeFrom: (value: string) => void;
  setPostalCodeTo: (value: string) => void;
  setTotalWeight: (value: number) => void;
  setTotalPrice: (value: number) => void;
}

export const PostalCodeContext = React.createContext<PostalCodeContextType | undefined>(undefined);
// FIX: Removed the self-referential import which caused a circular dependency and compilation errors.
export enum Language {
  ENGLISH = 'en-IN',
  HINDI = 'hi-IN',
}

export interface Bus {
  id: string;
  name: string;
  type: 'Express' | 'Deluxe' | 'Volvo' | 'Sleeper';
  from: string;
  to: string;
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  duration: string; // Xh Ym
  fare: number;
  platform: number;
  route: string[];
}


export interface Location {
  en: string;
  hi: string;
}
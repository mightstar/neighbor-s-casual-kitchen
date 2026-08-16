export type ChatTable = {
  id: string;
  label: string;
  seats: number;
  zone: string;
};

export type ChatDish = {
  name: string;
  slug: string;
  price: string;
};

export type BookingContext = {
  date: string;
  start: string;
  durationMinutes: number;
  partySize: number;
};

export type ChatUi = {
  tables?: ChatTable[];
  dishes?: ChatDish[];
  context?: BookingContext;
  needLogin?: boolean;
  reservation?: {
    tableLabel: string;
    date: string;
    start: string;
    durationMinutes: number;
    partySize: number;
  };
};

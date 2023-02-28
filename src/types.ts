export type Country = {
  name: string;
  class: string;
};

export type Genre = {
  name: string;
  link: string;
};

export type Band = {
  name: string;
  img?: string;
  link: string;
  timestamp: Date;
  country: Country;
  genres: Genre[];
};
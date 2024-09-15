export interface IDog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}

export interface IMatch {
    match: string;
}

export interface ILocation {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    county: string;
}

export interface ICoordinates {
    lat: number;
    lon: number;
  }
  

export type Room = {
  id: number;
  name: string;
  pax: string;
  type: string;
  price: number;
  bed: string;
  extraBed: number;
  amenities: string[];
};

const rooms: Room[] = [
  {
    id: 1,
    name: "Room 1",
    pax: "6-8",
    type: "Family Room",
    price: 3000,
    bed: "3",
    extraBed: 1,
    amenities: ["Air Conditioner", "TV", "Shower"],
  },
  {
    id: 2,
    name: "Room 2",
    pax: "4-6",
    type: "Family",
    price: 1500,
    bed: "2",
    extraBed: 1,
    amenities: ["Air Conditioner", "TV", "Shower"],
  },
  {
    id: 3,
    name: "Room 3",
    pax: "6-10",
    type: "Family Room",
    price: 3000,
    bed: "3",
    extraBed: 2,
    amenities: ["Air Conditioner", "TV", "Shower"],
  },
  {
    id: 4,
    name: "Room 4",
    pax: "4-6",
    type: "",
    price: 1500,
    bed: "1 Double Deck",
    extraBed: 1,
    amenities: ["Air Conditioner", "TV", "Shower"],
  },
  {
    id: 5,
    name: "Room 5",
    pax: "2-4",
    type: "Couple Room",
    price: 1000,
    bed: "1",
    extraBed: 1,
    amenities: ["Air Conditioner", "TV", "Shower"],
  },
  {
    id: 6,
    name: "Room 6",
    pax: "2-4",
    type: "Couple Room",
    price: 1000,
    bed: "1",
    extraBed: 1,
    amenities: ["Air Conditioner", "TV", "Shower"],
  },
  {
    id: 7,
    name: "Room 7",
    pax: "8-10",
    type: "Family Room",
    price: 3000,
    bed: "2 and 1 Double Deck",
    extraBed: 1,
    amenities: ["Air Conditioner", "TV", "Shower"],
  },
];

export default rooms;

export type RoomType = "single" | "double" | "suite";

export interface Booking {
  id: string;
  type: "room" | "sauna";
  createdAt: string;
  name: string;
  roomNumber: string;
  checkedOut: boolean;
}

export interface RoomBooking extends Booking {
  type: "room";
  roomType: RoomType;
  guests: number;
}

export interface SaunaBooking extends Booking {
  type: "sauna";
  time: string;
  guests: number;
}

export type AnyBooking = RoomBooking | SaunaBooking;

export const ROOM_RANGES: Record<RoomType, { start: number; end: number }> = {
  single: { start: 100, end: 119 },
  double: { start: 200, end: 214 },
  suite: { start: 300, end: 302 },
};

export const ROOM_TYPE_NAMES: Record<RoomType, string> = {
  single: "Enkelrum",
  double: "Dubbelrum",
  suite: "Svit",
};

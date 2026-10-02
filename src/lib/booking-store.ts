import { AnyBooking, ROOM_RANGES, RoomType } from "./bookings";

const STORAGE_KEY = "hotel-bookings";

export function getBookings(): AnyBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnyBooking[];
  } catch {
    return [];
  }
}

function saveBookings(bookings: AnyBooking[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(
  booking: Omit<AnyBooking, "id" | "createdAt" | "checkedOut">
): AnyBooking {
  const bookings = getBookings();
  const newBooking: AnyBooking = {
    ...booking,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    checkedOut: false,
  } as AnyBooking;
  bookings.push(newBooking);
  saveBookings(bookings);
  return newBooking;
}

export function checkOutRoom(id: string): void {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    bookings[index].checkedOut = true;
    saveBookings(bookings);
  }
}

export function getBookingsByRoom(roomNumber: string): AnyBooking[] {
  return getBookings().filter((b) => b.roomNumber === roomNumber);
}

export function getNextRoomNumber(roomType: RoomType): string {
  const range = ROOM_RANGES[roomType];
  const bookings = getBookings().filter(
    (b) => b.type === "room" && b.roomType === roomType && !b.checkedOut
  );
  const usedNumbers = new Set(bookings.map((b) => parseInt(b.roomNumber, 10)));
  for (let i = range.start; i <= range.end; i++) {
    if (!usedNumbers.has(i)) {
      return i.toString();
    }
  }
  return range.start.toString();
}

export function getAvailableRoomCount(roomType: RoomType, total: number): number {
  const bookings = getBookings().filter(
    (b) => b.type === "room" && b.roomType === roomType && !b.checkedOut
  );
  return total - bookings.length;
}

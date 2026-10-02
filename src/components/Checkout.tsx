import { useState, useEffect } from "react";
import { Check, LogOut, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBookings, checkOutRoom } from "@/lib/booking-store";
import { AnyBooking, ROOM_TYPE_NAMES } from "@/lib/bookings";

export function Checkout() {
  const [bookings, setBookings] = useState<AnyBooking[]>([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const refresh = () => setBookings(getBookings());

  const handleCheckOut = (id: string) => {
    checkOutRoom(id);
    refresh();
    toast.success("Rum utcheckat", { description: "Rummet är nu tillgänglig för nya gäster." });
  };

  const checkedIn = bookings.filter((b) => !b.checkedOut);
  const checkedOut = bookings.filter((b) => b.checkedOut);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Utcheckning</p>
        <h1 className="font-display text-4xl leading-tight md:text-6xl">Utcheckning</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Hantera utcheckningar för gäster. Bokningar raderas aldrig — de markeras som utcheckade och flyttas till historiken.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl">
            <LogIn className="size-5 text-success" /> Incheckade ({checkedIn.length})
          </h2>
          {checkedIn.length === 0 ? (
            <div className="border border-border bg-card p-6 text-center text-muted-foreground">
              Inga incheckade gäster just nu.
            </div>
          ) : (
            <div className="space-y-3">
              {checkedIn.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onCheckOut={handleCheckOut} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl">
            <LogOut className="size-5 text-muted-foreground" /> Utcheckade ({checkedOut.length})
          </h2>
          {checkedOut.length === 0 ? (
            <div className="border border-border bg-card p-6 text-center text-muted-foreground">
              Inga utcheckade gäster ännu.
            </div>
          ) : (
            <div className="space-y-3">
              {checkedOut.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onCheckOut }: { booking: AnyBooking; onCheckOut?: (id: string) => void }) {
  const isRoom = booking.type === "room";
  const roomBooking = isRoom ? (booking as AnyBooking & { type: "room" }) : null;
  const saunaBooking = !isRoom ? (booking as AnyBooking & { type: "sauna" }) : null;

  return (
    <div className={cn("border bg-card p-5", booking.checkedOut ? "border-border opacity-60" : "border-primary")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl">{booking.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isRoom
              ? `${ROOM_TYPE_NAMES[roomBooking!.roomType]} · Rum ${booking.roomNumber} · ${roomBooking!.guests} pers.`
              : `Bastu ${saunaBooking!.time} · Rum ${booking.roomNumber} · ${saunaBooking!.guests} pers.`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Bokad: {new Date(booking.createdAt).toLocaleString("sv-SE")}
          </p>
        </div>
        {onCheckOut && (
          <Button variant="outline" size="sm" onClick={() => onCheckOut(booking.id)}>
            <Check className="size-4" /> Checka ut
          </Button>
        )}
      </div>
    </div>
  );
}

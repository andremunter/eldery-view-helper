import { useMemo, useState } from "react";
import { BedDouble, BedSingle, Check, Fish, Mountain, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { addBooking, getNextRoomNumber, getAvailableRoomCount } from "@/lib/booking-store";
import { RoomType } from "@/lib/bookings";

type Counts = Record<RoomType, number>;

const rooms: Array<{ id: RoomType; name: string; total: number; capacity: number; squeeze: number; icon: typeof BedDouble; text: string }> = [
  { id: "single", name: "Enkelrum", total: 20, capacity: 1, squeeze: 2, icon: BedSingle, text: "En säng, ett fönster, total frid." },
  { id: "double", name: "Dubbelrum", total: 15, capacity: 2, squeeze: 3, icon: BedDouble, text: "Dubbelsäng och utsikt mot skogen." },
  { id: "suite", name: "Svit", total: 3, capacity: 4, squeeze: 6, icon: Mountain, text: "En dubbelsäng + två enkelsängar, utsikt över fjället och jacuzzi på balkongen. Varmt vatten kostar en tonfisk till Kjell." },
];

const ROOM_TOTALS: Record<RoomType, number> = { single: 20, double: 15, suite: 3 };

const empty: Counts = { single: 0, double: 0, suite: 0 };
const capacityOf = (c: Counts, key: "capacity" | "squeeze" = "capacity") => rooms.reduce((sum, r) => sum + c[r.id] * r[key], 0);
const roomCount = (c: Counts) => c.single + c.double + c.suite;
const TOTAL_ROOMS = rooms.reduce((sum, r) => sum + r.total, 0);
const MAX_BEDS = rooms.reduce((sum, r) => sum + r.total * r.capacity, 0);
const MAX_SQUEEZE = rooms.reduce((sum, r) => sum + r.total * r.squeeze, 0);

function suggest(people: number, key: "capacity" | "squeeze"): Counts | null {
  const s = { ...empty };
  let left = people;
  // Grupper fyller svitar först, sedan dubbelrum, och resten i enkelrum.
  for (const id of ["suite", "double", "single"] as RoomType[]) {
    const r = rooms.find((x) => x.id === id)!;
    if (id === "suite" && people < 4) continue;
    const n = Math.min(r.total, Math.floor(left / r[key]));
    s[id] = n;
    left -= n * r[key];
  }
  for (const id of ["single", "double", "suite"] as RoomType[]) {
    const r = rooms.find((x) => x.id === id)!;
    if (left > 0 && s[id] < r.total) { s[id]++; left -= r[key]; }
  }
  return left > 0 ? null : s;
}

const describe = (c: Counts) => rooms.filter((r) => c[r.id] > 0).map((r) => `${c[r.id]} ${r.name.toLowerCase()}${c[r.id] > 1 && r.id !== "suite" ? "" : ""}`).join(", ");

export function RoomBooking() {
  const [people, setPeople] = useState(2);
  const [counts, setCounts] = useState<Counts>({ ...empty, double: 1 });
  const [booked, setBooked] = useState(false);
  const [guestName, setGuestName] = useState("");

  const normal = useMemo(() => suggest(people, "capacity"), [people]);
  const squeezed = useMemo(() => (normal ? null : suggest(people, "squeeze")), [people, normal]);
  const cap = capacityOf(counts);
  const squeezeCap = capacityOf(counts, "squeeze");
  const total = roomCount(counts);

  const step = (id: RoomType, d: number) => {
    const r = rooms.find((x) => x.id === id)!;
    setBooked(false);
    setCounts((c) => ({ ...c, [id]: Math.max(0, Math.min(r.total, c[id] + d)) }));
  };

  const book = () => {
    if (!guestName.trim()) { toast.error("Fyll i ditt namn"); return; }
    if (total === 0) { toast.error("Välj minst ett rum"); return; }
    if (people > squeezeCap) { toast.error("Alla får inte plats", { description: "Följ Hildurs förslag eller lägg till fler rum." }); return; }

    try {
      const bookings: Array<{ type: "room"; roomType: RoomType; guests: number; roomNumber: string }> = [];
      for (const r of rooms) {
        const count = counts[r.id];
        for (let i = 0; i < count; i++) {
          const roomNumber = getNextRoomNumber(r.id);
          const booking = { type: "room" as const, roomType: r.id, guests: r.capacity, roomNumber, name: guestName.trim() };
          addBooking(booking);
          bookings.push(booking);
        }
      }

      setBooked(true);
      toast.success("Bokningen är klar!", { description: `${guestName.trim()} — ${people} personer i ${describe(counts)}. Rum: ${bookings.map((b) => b.roomNumber).join(", ")}` });
    } catch (e) {
      toast.error("Inga lediga rum", { description: e instanceof Error ? e.message : "Okänt fel" });
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Boka rum · 38 rum</p>
        <h1 className="font-display text-4xl leading-tight md:text-6xl">Var vill du sova i natt?</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">15 dubbelrum, 20 enkelrum och 3 svitar. Säg hur många ni är så föreslår Hildur resten.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="border border-border bg-card p-5">
            <Label htmlFor="guest-name">Ditt namn</Label>
            <Input id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="mt-2" placeholder="För- och efternamn" />
          </div>
          <div className="flex items-center justify-between gap-4 border border-border bg-card p-5">
            <div><Label>Antal personer</Label><p className="mt-1 text-xs text-muted-foreground">Max 62 i ordinarie bäddar</p></div>
            <Stepper value={people} min={1} max={MAX_SQUEEZE} onMinus={() => { setBooked(false); setPeople(Math.max(1, people - 1)); }} onPlus={() => { setBooked(false); setPeople(people + 1); }} onChange={(v) => { setBooked(false); setPeople(v); }} ariaLabel="antal personer" />
          </div>

          {rooms.map((r) => (
            <div key={r.id} className={cn("grid gap-4 border bg-card p-5 sm:grid-cols-[3rem_1fr_auto] sm:items-center", counts[r.id] > 0 ? "border-primary" : "border-border")}>
              <div className="grid size-12 place-items-center bg-gold-soft text-gold-deep"><r.icon /></div>
              <div>
                <h2 className="font-display text-2xl">{r.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                <p className="mt-2 text-xs font-bold uppercase text-muted-foreground">{r.capacity} {r.capacity === 1 ? "person" : "personer"} · {r.total} rum totalt</p>
                {r.id === "suite" && <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-deep"><Fish className="size-3" /> Jacuzzi-värme: 1 tonfisk/kväll</p>}
              </div>
              <Stepper value={counts[r.id]} min={0} max={r.total} onMinus={() => step(r.id, -1)} onPlus={() => counts[r.id] < r.total ? step(r.id, 1) : toast.warning(`Alla ${r.name.toLowerCase()} är valda`)} onChange={(v) => { setBooked(false); setCounts((c) => ({ ...c, [r.id]: v })); }} ariaLabel={`antal ${r.name.toLowerCase()}`} />
            </div>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase text-muted-foreground">Tillgängliga rum</p>
            <ul className="mt-3 space-y-2">
              {rooms.map((r) => {
                const available = getAvailableRoomCount(r.id, ROOM_TOTALS[r.id]);
                return (
                  <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2"><r.icon className="size-4 text-gold-deep" /> {r.name}</span>
                    <span className="font-semibold">{available} av {ROOM_TOTALS[r.id]} lediga</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
              {TOTAL_ROOMS} rum totalt · {MAX_BEDS} bäddar · {MAX_SQUEEZE} platser ihopträngt
            </p>
          </div>

          <div className="bg-primary p-6 text-primary-foreground">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Sparkles className="size-4 text-gold" /> Hildur föreslår</p>
            {normal ? (
              <>
                <p className="font-display text-2xl">För {people} {people === 1 ? "person" : "personer"}: {describe(normal)}.</p>
                <Button variant="gold" className="mt-4" onClick={() => { setCounts(normal); setBooked(false); }}>Använd förslaget</Button>
              </>
            ) : squeezed ? (
              <>
                <p className="font-display text-2xl">Ni får inte plats i vanliga bäddar. Tränga ihop er?</p>
                <p className="mt-2 text-sm opacity-80">Två per enkelrum, tre per dubbelrum och sex i varje svit. Mysigt! Kjell lånar ut sin filt.</p>
                <p className="mt-3 font-semibold">{describe(squeezed)}</p>
                <Button variant="gold" className="mt-4" onClick={() => { setCounts(squeezed); setBooked(false); }}>Tränga ihop oss</Button>
              </>
            ) : (
              <p className="font-display text-2xl">{people} personer ryms inte ens om alla trängs ihop (max {MAX_SQUEEZE}). Hildur föreslår tält på fjället.</p>
            )}
          </div>

          <div className="border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase text-muted-foreground">Din bokning</p>
            <p className="mt-2 font-display text-3xl">{total} rum · {people} pers.</p>
            <p className="mt-1 text-sm text-muted-foreground">{total ? describe(counts) : "Inga rum valda"}</p>
            <div className={cn("mt-4 flex items-start gap-3 p-4 text-sm", people <= cap ? "bg-success-soft text-success" : people <= squeezeCap ? "bg-gold-soft text-gold-deep" : "bg-destructive/10 text-destructive")}>
              <Users className="size-5 shrink-0" />
              <span>{people <= cap ? `Alla får plats (${cap} bäddar).` : people <= squeezeCap ? `Ni är ${people - cap} för många — Hildur föreslår att ni tränger ihop er.` : `${people - squeezeCap} personer saknar plats även om ni tränger ihop er.`}</span>
            </div>
            <Button className="mt-4 w-full" onClick={book}>{booked ? <><Check /> Bokat</> : "Boka rum"}</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stepper({ value, onMinus, onPlus, onChange, min = 0, max, ariaLabel }: { value: number; onMinus: () => void; onPlus: () => void; onChange: (v: number) => void; min?: number; max?: number; ariaLabel: string }) {
  const clamp = (v: number) => {
    const n = Math.max(min, max !== undefined ? Math.min(max, v) : v);
    onChange(n);
  };
  return (
    <div className="flex items-center self-start border border-border sm:self-auto">
      <Button variant="ghost" size="icon" onClick={onMinus} aria-label={`Minska ${ariaLabel}`}>−</Button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v)) clamp(v);
          else if (e.target.value === "") onChange(min);
        }}
        onBlur={(e) => {
          if (e.target.value === "") onChange(min);
        }}
        className="w-11 border-0 bg-transparent text-center font-display text-xl outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label={ariaLabel}
      />
      <Button variant="ghost" size="icon" onClick={onPlus} aria-label={`Öka ${ariaLabel}`}>+</Button>
    </div>
  );
}

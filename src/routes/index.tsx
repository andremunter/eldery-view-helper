import { createFileRoute } from "@tanstack/react-router";
import {
  BedDouble,
  BellRing,
  Cat,
  Check,
  ChevronRight,
  Cloud,
  CloudSun,
  Coffee,
  Cpu,
  Flame,
  Fish,
  Eye,
  Hand,
  HeartPulse,
  Languages,
  LockKeyhole,
  Moon,
  Power,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  TriangleAlert,
  Users,
  VolumeX,
  WifiOff,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RoomBooking } from "@/components/RoomBooking";
import bongoCatUp from "@/assets/bongo-cat-up.png";
import bongoCatSlap from "@/assets/bongo-cat-slap.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hildur 4.0 — Hotell Hjortronet, Hemavan" },
      {
        name: "description",
        content: "Möt Hildur 4.0, din digitala receptionist på Hotell Hjortronet i Hemavan.",
      },
      { property: "og:title", content: "Hildur 4.0 — Hotell Hjortronet" },
      {
        property: "og:description",
        content: "Gästservice, trygghet och fjällvärme från Hotell Hjortronet i Hemavan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotelApp,
});

type Language = "sv" | "en" | "sma";
type View = "welcome" | "booking" | "services" | "security" | "infra";
type DisplayMode = "standard" | "senior";

const copy = {
  sv: {
    nav: ["Välkommen", "Boka rum", "Gästtjänster", "Trygghet & säkerhet", "Drift & infrastruktur"],
    hello: "Buerie båeteme.",
    intro: "Hej! Jag är Hildur 4.0. Fråga mig om fjället, boka bastun eller beställ frukost. Jag rimmar inte längre och har slutat starta om mitt i en mening.",
    ask: "Vad kan jag hjälpa dig med?",
    weather: "Vädret i Hemavan",
    aurora: "Norrskenslarm",
    catStatus: "Kjell, hotellkatt",
    sleepy: "Sömnig",
    revoked: "Bastuvakt · f.d. systemadmin",
    live: "Hotellet just nu",
    servicesTitle: "Vad får det lov att vara?",
    servicesIntro: "Hildur ordnar resten. Alla beställningar gäller din nuvarande vistelse.",
    securityTitle: "Tryggt, tyst och krypterat.",
    securityIntro: "Hildur 4.0 skyddar gästernas uppgifter från incheckning till utcheckning.",
    infraTitle: "Hildur har lämnat bastun.",
    infraIntro: "En robust driftkedja byggd för fjällväder, strömavbrott och riktigt varma bastukvällar.",
  },
  en: {
    nav: ["Welcome", "Book a room", "Guest services", "Safety & security", "Operations & infrastructure"],
    hello: "Buerie båeteme.",
    intro: "Hi! I'm Hildur 4.0. Ask me about the mountain, book the sauna or order breakfast. I no longer rhyme or reboot mid-sentence.",
    ask: "How can I help?",
    weather: "Weather in Hemavan",
    aurora: "Northern Lights alert",
    catStatus: "Kjell, hotel cat",
    sleepy: "Sleepy",
    revoked: "Sauna guard · former sysadmin",
    live: "The hotel right now",
    servicesTitle: "What can we do for you?",
    servicesIntro: "Hildur will arrange the rest. All orders apply to your current stay.",
    securityTitle: "Safe, quiet and encrypted.",
    securityIntro: "Hildur 4.0 protects guest information from check-in to check-out.",
    infraTitle: "Hildur has left the sauna.",
    infraIntro: "A resilient system built for mountain weather, power cuts and very hot sauna evenings.",
  },
  sma: {
    nav: ["Buerie båeteme", "Gåetiem böörkedh", "Gåessie-dïenesjh", "Jearsoesvoete", "Dååjrehtimmie"],
    hello: "Buerie båeteme Hjortronasse.",
    intro: "Manne Hildur 4.0. Manne datnem viehkehtem saavnine, beapmojne jïh vaeresne.",
    ask: "Mij maahtam viehkiehtidh?",
    weather: "Bïegke Hemavanisnie",
    aurora: "Guovssahas-vaaksjome",
    catStatus: "Kjell, gåetie-gaahkoe",
    sleepy: "Åerie",
    revoked: "Saavne-vaaksjije · ovmessie systemadmin",
    live: "Hoteelle daelie",
    servicesTitle: "Mij datne daarpesjh?",
    servicesIntro: "Hildur gaajhke öörnie. Dïenesjh dov orresem dåeriedieh.",
    securityTitle: "Jearsoes, sjeavohke jïh krypteereldh.",
    securityIntro: "Hildur 4.0 gåessie-daatide vaarjele.",
    infraTitle: "Hildur saavneste juhteme.",
    infraIntro: "Nænnoes dååjrehtimmie vaerie-bïegkese jïh straavme-boelhkide.",
  },
} as const;

const tabs: Array<{ id: View; icon: typeof Sparkles }> = [
  { id: "welcome", icon: Sparkles },
  { id: "booking", icon: BedDouble },
  { id: "services", icon: BellRing },
  { id: "security", icon: ShieldCheck },
  { id: "infra", icon: Cloud },
];

function HotelApp() {
  const [language, setLanguage] = useState<Language>("sv");
  const [displayMode, setDisplayMode] = useState<DisplayMode | null>(null);
  const [view, setView] = useState<View>("welcome");
  const [dark, setDark] = useState(true);
  const [catOpen, setCatOpen] = useState(false);
  const [tunaCans, setTunaCans] = useState(0);
  const [kjellPetted, setKjellPetted] = useState(false);
  const [kjellBribed, setKjellBribed] = useState(false);
  const t = copy[language];

  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors", dark && "dark", displayMode === "senior" && "senior-mode")}>
      {displayMode === null && (
        <div className="view-choice fixed inset-0 z-[100] grid place-items-center bg-lodge px-4 py-8 text-lodge-foreground" role="dialog" aria-modal="true" aria-labelledby="view-choice-title">
          <div className="mountain-lines absolute inset-0 opacity-25" />
          <div className="relative flex w-full max-w-4xl flex-col items-center text-center">
            <div className="mb-8 grid size-20 place-items-center border-2 border-gold bg-gold text-lodge">
              <span className="font-display text-4xl font-bold">H</span>
            </div>
            <p className="font-display text-2xl text-gold">Hotell Hjortronet</p>
            <h1 id="view-choice-title" className="mt-3 font-display text-4xl md:text-6xl">Välj hur sidan ska visas</h1>
            <div className="mt-12 flex w-full flex-col items-center gap-10">
              <Button
                variant="lodgeGhost"
                onClick={() => setDisplayMode("senior")}
                className="h-auto min-h-24 w-full max-w-3xl whitespace-normal px-8 py-7 font-display text-3xl leading-tight md:min-h-32 md:text-5xl"
              >
                <Eye className="size-10" /> SYNPROBLEM? TRYCK HÄR!
              </Button>
              <Button
                variant="gold"
                onClick={() => setDisplayMode("standard")}
                className="h-auto min-h-24 w-full max-w-3xl whitespace-normal px-8 py-7 font-display text-3xl leading-tight md:min-h-32 md:text-5xl"
              >
                Fortsätt till vanliga sidan
                <ChevronRight className="size-10" />
              </Button>
            </div>
          </div>
        </div>
      )}
      <header className="relative overflow-hidden border-b border-border bg-lodge text-lodge-foreground">
        <div className="mountain-lines absolute inset-0 opacity-25" />
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 md:px-8">
          <button className="group flex items-center gap-3 text-left" onClick={() => setView("welcome")}>
            <div className="grid size-10 place-items-center border border-gold/50 bg-gold text-lodge md:size-12">
              <span className="font-display text-xl font-bold">H</span>
            </div>
            <div>
              <p className="font-display text-lg leading-none md:text-xl">HOTELL HJORTRONET</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-gold">Hemavan · 65°49′ N</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden items-center border border-lodge-border bg-lodge-soft md:flex">
              <Languages className="mx-3 size-4 text-gold" />
              {(["sv", "en", "sma"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn("h-9 px-3 text-xs font-semibold uppercase transition-colors", language === lang ? "bg-gold text-lodge" : "text-lodge-muted hover:text-lodge-foreground")}
                >
                  {lang === "sv" ? "SV" : lang === "en" ? "EN" : "SÁ"}
                </button>
              ))}
            </div>
            <Button variant="lodgeGhost" size="icon" onClick={() => setDark(!dark)} aria-label={dark ? "Ljust läge" : "Mörkt läge"}>
              {dark ? <Sun /> : <Moon />}
            </Button>
            {displayMode !== null && (
              <Button variant="lodgeGhost" onClick={() => setDisplayMode(null)} className="px-3 md:px-4">
                <Eye /> <span className="hidden sm:inline">Ändra visning</span>
              </Button>
            )}
            <Button variant="gold" onClick={() => setCatOpen(true)} className="px-3 md:px-4">
              <Cat /> <span className="hidden sm:inline">Kjell katten</span>
            </Button>
          </div>
        </div>
        <nav className="relative mx-auto grid max-w-[1440px] grid-cols-5 px-1 md:px-8" aria-label="Huvudmeny">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={cn("flex min-h-16 items-center justify-center gap-2 border-t-2 px-2 text-xs font-semibold transition-all md:text-sm", view === tab.id ? "border-gold bg-lodge-soft text-gold" : "border-transparent text-lodge-muted hover:bg-lodge-soft hover:text-lodge-foreground")}
              >
                <Icon className="size-4 shrink-0" />
                <span className="hidden sm:inline">{t.nav[index]}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main>
        {view === "welcome" && <Welcome t={t} onNavigate={setView} />}
        {view === "booking" && <RoomBooking />}
        {view === "services" && <GuestServices t={t} tunaCans={tunaCans} setTunaCans={setTunaCans} kjellPetted={kjellPetted} setKjellPetted={setKjellPetted} kjellBribed={kjellBribed} setKjellBribed={setKjellBribed} />}
        {view === "security" && <Security t={t} />}
        {view === "infra" && <Infrastructure t={t} />}
      </main>

      <div className="fixed bottom-4 left-4 z-40 flex border border-border bg-background shadow-xl md:hidden">
        <Languages className="m-2 size-4 text-primary" />
        {(["sv", "en", "sma"] as Language[]).map((lang) => (
          <button key={lang} onClick={() => setLanguage(lang)} className={cn("px-3 text-xs font-bold uppercase", language === lang && "bg-primary text-primary-foreground")}>{lang}</button>
        ))}
      </div>

      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent className="overflow-hidden border-gold/40 p-0 sm:max-w-md">
          <div className="h-56 overflow-hidden bg-primary">
            <img src={bongoCatUp} alt="Kjell, Hotell Hjortronets hotellkatt" width={1024} height={1024} loading="lazy" className="h-full w-full object-contain" />
          </div>
          <DialogHeader className="px-6 pb-2 pt-4 text-left">
            <DialogTitle className="font-display text-3xl">Det här är Kjell.</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Vakt, skadedjursbekämpare, f.d. systemadmin, terapeut, misstänkt del av fjällmaffian och bastubevakare.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 border-t border-border bg-muted px-6 py-4 text-xs font-semibold uppercase text-muted-foreground">
            <Fish className="size-4" /> Ingen tonfisk, ingen bastu.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type Copy = (typeof copy)[Language];

function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="font-display text-4xl leading-tight md:text-6xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{text}</p>
    </div>
  );
}

function Welcome({ t, onNavigate }: { t: Copy; onNavigate: (view: View) => void }) {
  const [question, setQuestion] = useState("");
  const askHildur = () => {
    if (!question.trim()) return;
    toast.success("Hildur svarar", { description: "Bra fråga. Jag har skickat den till receptionens mänskliga expert." });
    setQuestion("");
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="relative min-h-[470px] overflow-hidden bg-primary p-6 text-primary-foreground md:p-12">
          <div className="mountain-lines absolute inset-0 opacity-20" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest">
                <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-gold" /></span>
                Hildur 4.0 · online
              </div>
              <h1 className="max-w-3xl font-display text-4xl leading-[1.08] md:text-7xl">{t.hello}</h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">{t.intro}</p>
            </div>
            <div className="mt-10 flex max-w-2xl gap-2 border-t border-primary-foreground/20 pt-5">
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askHildur()} placeholder={t.ask} className="h-12 border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Button variant="gold" size="lg" onClick={askHildur} aria-label="Skicka"><Send /></Button>
            </div>
          </div>
        </section>

        <aside className="border border-border bg-card p-6 md:p-8">
          <div className="mb-7 flex items-center justify-between">
            <h2 className="font-display text-2xl">{t.live}</h2>
            <span className="text-xs font-semibold text-muted-foreground">FRE 2 OKT · 10:09</span>
          </div>
          <StatusRow icon={CloudSun} label={t.weather} value="−2° · Lätt snö" meta="Vind 3 m/s · Tärnaby" />
          <StatusRow icon={Sparkles} label={t.aurora} value="AV" meta="Molnigt · KP 2" off />
          <StatusRow icon={Cat} label={t.catStatus} value={t.sleepy} meta={t.revoked} gold />
          <Button variant="outline" className="mt-6 w-full justify-between" onClick={() => onNavigate("services")}>
            {t.nav[2]} <ChevronRight />
          </Button>
        </aside>
      </div>
      <section className="mt-8 grid overflow-hidden border border-border bg-card lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-muted">
          <img src={bongoCatUp} alt="Kjell, Hotell Hjortronets hotellkatt" width={1024} height={1024} loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
          <div className="absolute bottom-4 left-4 bg-gold px-3 py-2 text-xs font-bold uppercase text-lodge">Bastubevakning pågår</div>
        </div>
        <div className="p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">Hotellets allt-i-allo</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Det här är Kjell.</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">Han håller ordning i korridorerna, lyssnar utan att döma och bevakar bastun med kompromisslös blick.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {["Vakt", "Skadedjursbekämpare", "F.d. systemadmin", "Terapeut", "Misstänkt fjällmaffia", "Bastubevakare"].map((role) => <span key={role} className="border border-border bg-muted px-3 py-2 text-sm font-semibold">{role}</span>)}
          </div>
          <div className="mt-8 flex flex-col gap-4 border-l-4 border-gold bg-gold-soft p-5 text-gold-deep sm:flex-row sm:items-center sm:justify-between">
            <div><strong className="font-display text-2xl">Ingen tonfisk, ingen bastu.</strong><p className="mt-1 text-sm">Kjells regler är enkla. Förhandling sker vid varuautomaten.</p></div>
            <Button variant="gold" onClick={() => onNavigate("services")}><Fish /> Besök bastun</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusRow({ icon: Icon, label, value, meta, off, gold }: { icon: typeof CloudSun; label: string; value: string; meta: string; off?: boolean; gold?: boolean }) {
  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border-t border-border py-5 first:border-t-0">
      <div className={cn("grid size-11 place-items-center bg-muted text-primary", gold && "bg-gold-soft text-gold-deep")}><Icon className="size-5" /></div>
      <div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{meta}</p></div>
      <span className={cn("text-right text-sm font-bold", off && "text-muted-foreground", gold && "text-gold-deep")}>{value}</span>
    </div>
  );
}

function GuestServices({ t, tunaCans, setTunaCans, kjellPetted, setKjellPetted, kjellBribed, setKjellBribed }: { t: Copy; tunaCans: number; setTunaCans: (n: number) => void; kjellPetted: boolean; setKjellPetted: (v: boolean) => void; kjellBribed: boolean; setKjellBribed: (v: boolean) => void }) {
  const [service, setService] = useState<"sauna" | "breakfast" | "issue">("sauna");
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("18:00");
  const [room, setRoom] = useState("");
  const [issue, setIssue] = useState("");
  const [kjellRevealed, setKjellRevealed] = useState(false);
  const [evasion, setEvasion] = useState(0);
  const serviceData = [
    { id: "sauna" as const, icon: Flame, title: "Boka bastun", sub: "Värme, utsikt och plats för 8" },
    { id: "breakfast" as const, icon: Coffee, title: "Frukost på rummet", sub: "Levereras 07:00–10:00" },
    { id: "issue" as const, icon: HeartPulse, title: "Rapportera ett problem", sub: "Vi hjälper dig direkt" },
  ];

  const submit = () => {
    if (service === "sauna" && !kjellRevealed) {
      setKjellRevealed(true);
      toast.warning("Kjell blockerar bokningen", { description: "Klappa bastuvakten och förhandla med tonfiskautomaten." });
      return;
    }
    if (service === "sauna" && !kjellBribed) {
      setEvasion((current) => current + 1);
      toast("Inte så fort", { description: "Kjell flyttade knappen. Ingen tonfisk, ingen bastu." });
      return;
    }
    if (service === "sauna" && !kjellPetted) {
      toast.error("Kjell kräver en klapp först");
      return;
    }
    if (service === "issue" && !issue.trim()) {
      toast.error("Berätta kort vad som hänt");
      return;
    }
    if ((service === "breakfast" || service === "issue") && !room.trim()) {
      toast.error("Fyll i ditt rumsnummer");
      return;
    }
    toast.success(service === "sauna" ? "Bastun är bokad!" : service === "breakfast" ? "Frukosten är beställd!" : "Felanmälan är mottagen!", {
      description: service === "sauna" ? `${time} för ${guests} ${guests === 1 ? "person" : "personer"}. Hildur har tänt aggregatet.` : "Receptionen bekräftar strax.",
    });
    setIssue("");
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16">
      <SectionHeading eyebrow="Hildur ordnar" title={t.servicesTitle} text={t.servicesIntro} />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          {serviceData.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => setService(item.id)} className={cn("flex w-full items-center gap-4 border p-5 text-left transition-all", service === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40")}><Icon className="size-6" /><span className="flex-1"><strong className="block font-display text-xl">{item.title}</strong><small className={cn("text-sm", service === item.id ? "text-primary-foreground/70" : "text-muted-foreground")}>{item.sub}</small></span><ChevronRight /></button>;
          })}
        </div>
        <div className="border border-border bg-card p-6 md:p-9">
          {service === "sauna" && <SaunaForm guests={guests} setGuests={setGuests} time={time} setTime={setTime} kjellRevealed={kjellRevealed} tunaCans={tunaCans} setTunaCans={setTunaCans} kjellPetted={kjellPetted} setKjellPetted={setKjellPetted} kjellBribed={kjellBribed} setKjellBribed={setKjellBribed} />}
          {service === "breakfast" && <BreakfastForm room={room} setRoom={setRoom} />}
          {service === "issue" && <IssueForm room={room} setRoom={setRoom} issue={issue} setIssue={setIssue} />}
          {service === "sauna" ? (
            <div className="relative mt-8 h-24 overflow-visible">
              <Button variant="gold" size="lg" className={cn("absolute left-1/2 w-[min(100%,22rem)] -translate-x-1/2 transition-all duration-200", kjellRevealed && !kjellBribed && ["top-0", "top-10 -translate-x-[85%]", "top-3 -translate-x-[15%]", "top-12 -translate-x-1/2"][evasion % 4])} onPointerEnter={() => kjellRevealed && !kjellBribed && setEvasion((current) => current + 1)} onClick={submit}>
                {kjellBribed ? kjellPetted ? "Bekräfta bastutid · först i kön" : "Klappa Kjell först" : "Bekräfta bastutid"}<Check />
              </Button>
            </div>
          ) : <Button variant="gold" size="lg" className="mt-8 w-full" onClick={submit}>{service === "breakfast" ? "Beställ frukost" : "Skicka till receptionen"}<Check /></Button>}
        </div>
      </div>
    </div>
  );
}

function SaunaForm({ guests, setGuests, time, setTime, kjellRevealed, tunaCans, setTunaCans, kjellPetted, setKjellPetted, kjellBribed, setKjellBribed }: { guests: number; setGuests: (n: number) => void; time: string; setTime: (s: string) => void; kjellRevealed: boolean; tunaCans: number; setTunaCans: (n: number) => void; kjellPetted: boolean; setKjellPetted: (v: boolean) => void; kjellBribed: boolean; setKjellBribed: (v: boolean) => void }) {
  const petKjell = () => { setKjellPetted(true); toast.success("Kjell spinner", { description: "Bastuvakten godkänner din klappteknik." }); };
  const buyTuna = () => { setTunaCans(tunaCans + 1); toast.success("Klunk!", { description: "En tonfiskburk rullade ut ur automaten." }); };
  const bribeKjell = () => {
    if (tunaCans < 1) { toast.error("Du behöver en tonfiskburk"); return; }
    setTunaCans(tunaCans - 1);
    setKjellBribed(true);
    toast.success("Förhandlingen är klar", { description: "Kjell placerar dig först i bastukön." });
  };
  return <div><FormTitle icon={Flame} title="Bastun" text="45 minuter · Handduk och fjällvatten ingår" /><Label>Välj tid</Label><div className="mt-2 grid grid-cols-3 gap-2">{["17:00", "18:00", "19:00", "20:00", "21:00"].map((slot) => <button key={slot} onClick={() => setTime(slot)} className={cn("h-11 border text-sm font-bold transition-colors", time === slot ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>{slot}</button>)}</div><div className="mt-7 flex items-end justify-between gap-4"><div><Label>Antal gäster</Label><p className="mt-1 text-xs text-muted-foreground">Max 8 personer av säkerhetsskäl</p></div><div className="flex items-center border border-border"><Button variant="ghost" size="icon" onClick={() => setGuests(Math.max(1, guests - 1))}>−</Button><span className="w-11 text-center font-display text-xl">{guests}</span><Button variant="ghost" size="icon" onClick={() => guests < 8 ? setGuests(guests + 1) : toast.warning("Bastun är full", { description: "Maxkapaciteten är 8 personer." })}>+</Button></div></div><div className="mt-6 flex items-center gap-3 bg-gold-soft p-4 text-sm text-gold-deep"><Users className="size-5" /><span><strong>{8 - guests} platser kvar</strong> på din bokning</span></div>{kjellRevealed && <div className="mt-6 animate-in fade-in slide-in-from-bottom-3 border-2 border-gold bg-muted p-4"><div className="grid gap-4 sm:grid-cols-[7rem_1fr]"><img src={kjellPortrait} alt="Kjell gömmer sig bakom bastumenyn" width={1200} height={912} loading="lazy" className="h-28 w-full object-cover" /><div><p className="font-display text-2xl">Kjell hittade dig.</p><p className="mt-1 text-sm text-muted-foreground">Ingen tonfisk, ingen bastu. En klapp är dessutom obligatorisk.</p><div className="mt-4 flex flex-wrap gap-2"><Button variant={kjellPetted ? "outline" : "default"} onClick={petKjell} disabled={kjellPetted}><Hand />{kjellPetted ? "Klappt och klart" : "Klappa Kjell"}</Button><Button variant="gold" onClick={bribeKjell} disabled={kjellBribed}><Fish />{kjellBribed ? "Först i kön" : "Ge tonfisk"}</Button></div></div></div></div>}<div className="mt-5 border border-border bg-background p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase text-muted-foreground">Tonfiskautomaten</p><p className="font-display text-xl">FJÄLLFISK 24/7</p></div><div className="grid size-12 place-items-center bg-primary text-primary-foreground"><Fish /></div></div><div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4"><span className="text-sm font-semibold">I fickan: {tunaCans} {tunaCans === 1 ? "burk" : "burkar"}</span><Button variant="outline" onClick={buyTuna}><Fish /> Köp tonfisk</Button></div></div></div>;
}

function BreakfastForm({ room, setRoom }: { room: string; setRoom: (s: string) => void }) {
  const [choice, setChoice] = useState("Fjällfrukost");
  return <div><FormTitle icon={Coffee} title="Frukost på rummet" text="Nygräddat, varmt och utanför din dörr" /><div className="space-y-2">{["Fjällfrukost", "Vegetarisk", "Barnfrukost"].map((item) => <button key={item} onClick={() => setChoice(item)} className={cn("flex w-full items-center justify-between border p-4 text-left font-semibold", choice === item ? "border-primary bg-muted" : "border-border")}><span>{item}</span>{choice === item && <Check className="size-4 text-primary" />}</button>)}</div><div className="mt-6"><Label htmlFor="room-breakfast">Rumsnummer</Label><Input id="room-breakfast" value={room} onChange={(e) => setRoom(e.target.value)} className="mt-2" placeholder="Till exempel 204" /></div></div>;
}

function IssueForm({ room, setRoom, issue, setIssue }: { room: string; setRoom: (s: string) => void; issue: string; setIssue: (s: string) => void }) {
  const [kjellPetted, setKjellPetted] = useState(false);
  const petKjell = () => {
    if (kjellPetted) return;
    setKjellPetted(true);
    toast.success("Kjell spinner", { description: "Terapeuten har gjort sitt. Känns det redan lite bättre?" });
  };
  return <div><FormTitle icon={HeartPulse} title="Hur kan vi hjälpa?" text="Akuta situationer: ring 112. Hildur meddelar receptionen direkt." /><div><Label htmlFor="room-issue">Rumsnummer</Label><Input id="room-issue" value={room} onChange={(e) => setRoom(e.target.value)} className="mt-2" placeholder="Till exempel 204" /></div><div className="mt-5"><Label htmlFor="issue">Beskriv problemet</Label><Textarea id="issue" value={issue} onChange={(e) => setIssue(e.target.value)} className="mt-2 min-h-28" placeholder="Till exempel: elementet är kallt..." /></div><div className="mt-6 flex items-center gap-4 border border-gold/50 bg-gold-soft p-4"><img src={kjellPortrait} alt="Kjell, hotellterapeuten, redo att bli klappad" width={1200} height={912} loading="lazy" className="size-20 shrink-0 border-2 border-gold object-cover" /><div className="min-w-0"><p className="font-display text-xl text-gold-deep">Klappa Kjell så kanske det känns bättre</p><Button variant={kjellPetted ? "outline" : "default"} className="mt-3" onClick={petKjell} disabled={kjellPetted}><Hand />{kjellPetted ? "Klappt och klart" : "Klappa Kjell"}</Button></div></div></div>;
}

function FormTitle({ icon: Icon, title, text }: { icon: typeof Flame; title: string; text: string }) {
  return <div className="mb-7 flex gap-4 border-b border-border pb-6"><div className="grid size-12 place-items-center bg-gold-soft text-gold-deep"><Icon /></div><div><h2 className="font-display text-3xl">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div></div>;
}

function Security({ t }: { t: Copy }) {
  const fixes = [
    { icon: VolumeX, number: "01", title: "Inga lösenord i högtalarna", text: "Hildur säger aldrig Wi‑Fi-lösenord eller gästuppgifter högt i allmänna utrymmen.", old: "Hildur 3000 ropade gärna ut dem vid frukosten." },
    { icon: Cat, number: "02", title: "Kjell har bytt karriär", text: "Vakt, skadedjursbekämpare, f.d. systemadmin, terapeut och bastubevakare. Han misstänks även vara en del av fjällmaffian.", old: "Ingen tonfisk, ingen bastu." },
    { icon: LockKeyhole, number: "03", title: "Gästdata är krypterad", text: "Information är skyddad både när den skickas och när den lagras.", old: "Ingen mer gästbok.txt på skrivbordet." },
  ];
  return <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16"><SectionHeading eyebrow="Trygghetslöftet" title={t.securityTitle} text={t.securityIntro} /><div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-y border-border py-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-success-soft text-success"><ShieldCheck /></span><div><strong className="block">Alla system skyddade</strong><small className="text-muted-foreground">Senast kontrollerat för 2 minuter sedan</small></div></div><span className="flex items-center gap-2 text-sm font-bold text-success"><span className="size-2 rounded-full bg-success" /> 3 av 3 åtgärdade</span></div><div className="grid gap-4 md:grid-cols-3">{fixes.map(({ icon: Icon, number, title, text, old }) => <article key={number} className="group border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-gold/60 hover:shadow-xl"><div className="mb-12 flex items-start justify-between"><div className="grid size-12 place-items-center bg-primary text-primary-foreground"><Icon /></div><span className="font-display text-5xl text-muted">{number}</span></div><h2 className="font-display text-2xl">{title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p><div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground"><span className="mb-1 block font-bold uppercase text-destructive">Åtgärdat från 3000</span><span className="line-through decoration-destructive/50">{old}</span></div></article>)}</div><div className="mt-8 grid items-center gap-6 border-2 border-gold bg-card p-6 md:grid-cols-[10rem_1fr] md:p-8"><img src={kjellPortrait} alt="Kjell bevakar hotellets säkerhetssystem" width={1200} height={912} loading="lazy" className="h-40 w-full border-2 border-gold object-cover md:h-40" /><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">Vakt · Säkerhetsansvarig · Fjällmaffia?</p><p className="mt-3 font-display text-2xl leading-snug md:text-3xl">Kjell är och har koll på hotellets alla olika säkerhetssystem, ingen obehörig tar sig genom varken dörren eller brandväggen och hans fällor fångar allt.</p><p className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Cat className="size-4 text-gold-deep" /> Rond trettioen pågår. Katten ser allt.</p></div></div></div>;
}

function Infrastructure({ t }: { t: Copy }) {
  const [powerOut, setPowerOut] = useState(false);
  const statuses = useMemo(() => powerOut ? ["Offline", "Offline", "Aktiv reserv"] : ["Online", "Synkad", "Redo"], [powerOut]);
  const nodes = [
    { icon: Cloud, label: "Säker molndrift", detail: "Primär drift · Sverige", status: statuses[0] },
    { icon: Radio, label: "Hotell Hjortronet", detail: "Krypterad anslutning", status: statuses[1] },
    { icon: Cpu, label: "Raspberry Pi", detail: "Lokal reserv · Receptionen", status: statuses[2] },
  ];
  return <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="Drift & infrastruktur" title={t.infraTitle} text={t.infraIntro} /><div className="relative mt-20 self-start md:self-auto"><div className="kjell-threat pointer-events-none absolute -right-2 -top-20 z-10 flex items-end"><div className="mb-8 max-w-36 border border-gold bg-background px-3 py-2 text-xs font-bold shadow-lg">Tryck då. Jag vågar dig.</div><img src={kjellPortrait} alt="Kjell vakar över strömavbrottsknappen" width={1200} height={912} loading="lazy" className="h-24 w-24 border-2 border-gold object-cover" /></div><Button variant={powerOut ? "destructive" : "outline"} size="lg" onClick={() => { setPowerOut(!powerOut); toast(powerOut ? "Strömmen är tillbaka" : "Simulerat strömavbrott", { description: powerOut ? "Molndriften synkar igen." : "Raspberry Pi-reserven tar över lokalt. Kjell ser nöjd ut." }); }}><Power />{powerOut ? "Återställ ström" : "Testa strömavbrott"}</Button></div></div><div className="relative mt-4 border border-border bg-card p-6 md:p-10"><div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">{nodes.map(({ icon: Icon, label, detail, status }, index) => <div key={label} className="contents"><article className={cn("relative border p-6 text-center transition-all", status === "Offline" ? "border-destructive/40 bg-destructive/5 opacity-55" : status === "Aktiv reserv" ? "border-gold bg-gold-soft" : "border-border bg-background")}><div className="mx-auto mb-5 grid size-14 place-items-center bg-primary text-primary-foreground"><Icon className="size-7" /></div><h2 className="font-display text-xl">{label}</h2><p className="mt-2 text-xs text-muted-foreground">{detail}</p><span className={cn("mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase", status === "Offline" ? "text-destructive" : "text-success")}><span className="size-2 rounded-full bg-current" />{status}</span></article>{index < nodes.length - 1 && <div className="flex items-center justify-center text-muted-foreground"><div className="h-px flex-1 bg-border md:h-20 md:w-px md:flex-none" /><ChevronRight className="size-5 rotate-90 md:rotate-0" /></div>}</div>)}</div><div className="mt-8 flex gap-3 border-l-4 border-gold bg-gold-soft p-5 text-gold-deep"><ThermometerSun className="mt-0.5 size-5 shrink-0" /><p className="text-sm leading-relaxed"><strong>Bastun är nu bara en bastu.</strong> Hildur 3000:s server stod tidigare under lavarna. Hildur 4.0 körs svalt, säkert och med lokal reservkraft.</p></div>{powerOut && <div className="mt-4 flex items-center gap-3 border border-success/30 bg-success-soft p-4 text-sm text-success"><WifiOff className="size-5" /><strong>Reservläge aktivt:</strong> dörrlås, brandlarm och reception fungerar lokalt.</div>}</div></div>;
}
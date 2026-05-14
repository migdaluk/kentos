# kentos-web — notatki projektowe

## Co zostało zrobione

Konwersja `kentos-landing.html` → Next.js 14 App Router.

### Pliki
- `app/layout.tsx` — root layout z metadanymi i czcionkami Google przez `next/font/google`
- `app/globals.css` — cały CSS z oryginału; zmienne fontów przepięte na CSS custom properties (`--font-archivo` itd.)
- `app/page.tsx` — strona jako Client Component; formularz e-mail z obsługą stanów (idle / loading / success / error)
- `app/api/waitlist/route.ts` — `POST /api/waitlist`; walidacja e-maila, deduplicja, zapis do `data/waitlist.json`
- `package.json`, `tsconfig.json`, `next.config.js`, `.gitignore`

### Decyzje
- Czcionki: `Archivo` (800/900), `Inter` (400/500/600), `JetBrains Mono` (400/500) — zero layout shift
- Calendly: zwykły `<a target="_blank" rel="noopener noreferrer">`, bez embeda
- `data/waitlist.json` w `.gitignore`; katalog tworzony automatycznie przy pierwszym zapisie
- `next build` przechodzi czysto

---

## TODO

### Pilne (przed produkcją)
- [ ] Zamienić zapis do `data/waitlist.json` na **Resend** (lub inną bazę) — plik nie przetrwa deploymentu na Vercel
- [ ] Dodać `RESEND_API_KEY` do zmiennych środowiskowych w Vercel
- [ ] Podpiąć domenę `kentos.ai` w ustawieniach Vercel

### Produkt
- [ ] Strona `/product` — na razie link w nav prowadzi do `#`
- [ ] Strona `/pricing` — na razie link w nav prowadzi do `#`
- [ ] Strona `/privacy` — na razie link w footerze prowadzi do `#`

### UX / polish
- [ ] Responsywność — layout mobilny (nav, hero, stats grid, solution cols)
- [ ] OG image / meta tagi social (`og:image`, `twitter:card`)
- [ ] Favicon
- [ ] Animacja wejścia hero (opcjonalnie)

### Tech
- [ ] Dodać `eslint` + `prettier` do projektu
- [ ] Skonfigurować `next/image` jeśli pojawią się obrazki
- [ ] Rozważyć `middleware.ts` do rate-limitingu endpointu `/api/waitlist`

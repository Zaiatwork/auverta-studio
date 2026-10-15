# Auverta Studio design brief

Agents read this before every design pass. Edit it; do not work around it.

## Brand
- Adjectives: precise, confident, editorial.
- Audience: founders and teams hiring a studio for brand + web.
- Palette: ink `#0b0b12`, paper `rgb(244 243 239)`, violet `#5b21fa` (light accent), lime `#d4f52a` (dark accent). No new colors.
- Type: Ghiga (display), Grift (body). No new fonts.

## Must not change
- The split-icon mark and its scroll journey (`IconJourney`, `JourneyScene`, `lib/journey.ts`).
- Brand fonts, light/dark themes, dash-free copy (no em or en dashes in text).
- Reduced-motion fallbacks.

## Quality bar
- No horizontal overflow at 390, 768, 1440.
- Body text contrast at least 4.5:1, large text at least 3:1, both themes.
- Tap targets at least 44px on mobile.
- One clear focal point per section. Consistent spacing from `--section-space` and `--gutter`.
- Console clean: no errors or hydration warnings.

## Loop
Screenshot each section at 390/768/1440 in light and dark, critique against this file, fix the 3 worst issues, re-check. Max 3 rounds. Commit per round.

---
name: editorial-service-booking
description: Create or redesign appointment-based service websites for salons, barbers, spas, wellness studios, clinics, and hospitality brands. Use for warm editorial layouts, serif-led identity, documentary portrait crops, calm treatment selectors, location-aware booking, and operational states that remain elegant and trustworthy.
---

# Editorial Service Booking

Make browsing services feel like turning through a quiet lookbook, then carry that confidence into a resilient booking flow.

## Establish the Journey

1. Open with one strong portrait or place image and a short statement of craft.
2. Build trust with environment, process, and practitioner evidence rather than generic badges.
3. Let visitors compare treatments in one calm media-and-copy stage.
4. Show favorites, results, or verified customer proof only when real.
5. Move into location, professional, time, and confirmation without changing visual language.

Use original or licensed people and place photography. Replace every source service, price, person, location, review, and claim.

## Build the Visual System

- Use warm ivory paper and near-black chapters.
- Pair an elegant high-contrast serif with compact sans-serif labels.
- Favor hairline rules, minimal radius, editorial crops, and generous whitespace.
- Keep uppercase navigation sparse and quiet.
- Use black for decisive actions; use one muted accent only for selection or status.
- Avoid glossy cards, glass effects, loud gradients, and beauty-template ornament.

## Compose the Page

- Header: show essential routes, current location, and one booking action.
- Hero: use one cropped documentary portrait or place image with a large serif statement.
- Confidence line: allow one slow text loop only when it carries real positioning.
- About: layer two or three photographs with captions and clear reading order.
- Treatments: pair a tab list with a reserved media stage, duration, price, and booking link.
- Favorites: use a dark chapter to show verified popular services or results.
- Locations: expose address, hours, accessibility, contact, and availability before booking.
- Booking: keep selected service, professional, location, and time visible through confirmation.
- Footer: prioritize operational information over marketing filler.

## Implement the Treatment Selector

- Use semantic buttons with `tablist`, `tab`, and `tabpanel` behavior when tabs are appropriate.
- Support arrow-key movement plus Enter and Space selection.
- Keep duration, price, description, and action in the DOM.
- Reserve stage dimensions and preload only the next likely image.
- Announce the selected treatment without repeating the whole panel.
- Fall back to an expanded static list under reduced motion.
- Keep focus and hover cues equivalent; touch must not depend on hover.

## Implement the Booking Flow

- Prefer native form controls and server-validated availability.
- Persist service, professional, location, and time choices.
- Never claim a slot before server confirmation.
- Design loading, empty, disabled, stale slot, invalid details, payment failure, retry, reschedule, cancel, and success states.
- Return focus to the correct field after an error and announce validation clearly.
- Preserve selections across Back navigation and recoverable failures.

## Motion Defaults

- Use 160–220ms for controls and 500–760ms for section entrances.
- Keep the confidence loop slower than 14 seconds and pause it offscreen.
- Use one layered photo reveal, simple section fades, and short treatment-media swaps.
- Keep transforms shallow and reserve exact final layout pixels.
- Render the final state immediately for reduced motion.

## Validate

- Complete booking with keyboard and touch on mobile.
- Test a stale slot, failed media, server error, invalid field, and retry.
- Confirm no layout shift during treatment changes.
- Verify readable contrast, visible focus, alt text, 200% zoom, and correct tab order.
- Confirm all people, places, prices, results, and reviews are real, licensed, provided, or clearly marked internal placeholders.

## Avoid

- Dense price tables before desire or context exists.
- Hover-only treatment previews.
- Fake availability, reviews, results, or practitioner credentials.
- Auto-advancing carousels, frantic motion, and decorative beauty gradients.
- Losing booking selections after errors or navigation.

---

## Recreate prompt

## Editorial Service Booking Demo Prompts

## Minimal prompt

Use $editorial-service-booking to create an original appointment-based service website with warm editorial art direction, a calm treatment selector, and a booking path that preserves context through errors and recovery.

## Recreate the demo

Use $editorial-service-booking to recreate the design quality and behavior of the included Northline grooming-studio demo as a complete standalone `index.html`.

Build a warm ivory page with hairline rules, sparse uppercase navigation, an elegant serif display face, and near-black actions. Split the first screen between a large serif statement and an original documentary-style portrait composition. Keep supporting copy compact and allow generous whitespace. Avoid glossy cards, shadows, gradients that feel cosmetic, and generic salon ornament.

Below the hero, build a three-option treatment selector. Use semantic tabs or an equivalent accessible pattern. Each treatment must retain its name, description, duration, price, and action in a stable stage. Support arrow keys, Enter, Space, touch, visible focus, and polite selection announcements. Reserve the panel height so changing treatments never shifts layout. Under reduced motion, present an expanded static list or immediate state changes.

Carry the same visual confidence into booking. Account for location, professional, time, stale slots, validation, server errors, retry, and success. Do not claim availability before confirmation. Use only local HTML, CSS, JavaScript, and original abstract media.

## Remix prompt

Use $editorial-service-booking and the included demo as the quality bar for a different service business such as a spa, clinic, wellness studio, or hospitality concept. Replace the brand, treatments, prices, photography, location, and copy. Preserve the warm editorial hierarchy, documentary evidence, quiet selector, keyboard behavior, operational booking states, responsive layout, and reduced-motion support.

---

## References

- [Clipster live reference](https://clipster.framer.website/)
- [Clipster template listing](https://www.framer.com/community/marketplace/templates/clipster/)

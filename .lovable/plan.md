

## Plan: Add Bike Image + Abuse Button

### Changes to `src/components/game/WelcomeScreen.tsx`

#### 1. Copy uploaded image to assets
- Copy `user-uploads://IMG_3634.jpg` to `src/assets/kp-bike.jpg`

#### 2. Import the bike image
- Add `import kpBikeImage from '@/assets/kp-bike.jpg';` at the top

#### 3. Rizz Scene (Phase 2) — Add bike image above title
- Insert a small rounded image (w-32 h-24 or similar, `object-cover`) of the bike above the "KP's Rizz Attempt 💀" heading
- Keep everything else untouched

#### 4. Welcome Screen (Phase 1) — Add "abuse me" button
- Below the existing "Click here to see my rizz 🥰" button, add a smaller button: "Click here to abuse me 🤡"
- Style it smaller (e.g., `bg-red-500`, smaller padding/text) so it's clearly secondary
- On click: `window.open('https://wa.me/919573725363?text=sir%20meeru%20erriPuK%20ah%3F', '_blank')`

#### 5. Rizz Scene (Phase 2) — Add same "abuse me" button
- Below the "Tap to start the game" button, add the same "Click here to abuse me 🤡" button with the same WhatsApp link behavior

### No other layout changes — everything else stays as-is.


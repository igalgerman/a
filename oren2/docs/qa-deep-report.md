# Deep QA audit (stable build 3fdbc43) — screenshots in this folder

## P1
1. Lesson demo "?" box + static choices look interactive (lesson(), choicesStatic(), .ans CSS cursor:pointer, hintHTML()). Hint reveals answer early (num-pv2), "20 + 5 = ?" stays after reveal (~50 lessons), some "הבא" presses change nothing, tens hint uses "2 × 10" in world 1, two competing buttons. FIX A (chosen): example = real question with 3 big .chb buttons; right → burst + "עַכְשָׁו תּוֹרְךָ"; wrong → hintHTML(ex,1); 2nd wrong → highlight right; one button after answering. Use concrete manipulatives (tens sticks / ones cubes, CPA approach) in place-value / regrouping lessons. Auto-read each step.
2. Tour/coach bubble repeats every entry: coach() increments save.coach[key] without O.persist() (talents.js ~1288, copy in index.html ~3841); parentSandbox() (index.html ~1022) starts blank coach; cloudInit() waits 4s for window.claude on website before pulling family save. FIX: persist in coach(); home bubble once, no "להתחיל"; sandbox copies Oren's coach flags + tour/intros done; skip claude wait on website; tour replays only on friend tap; optionally close intro dialog if story.intro arrives on 'synced'.
3. Coach bubble covers doors/world cards/arcade cabinet and eats the tap → .cbub pointer-events:none or never overlap buttons.
4. World path runs left→right (current node far left) → mirror node x in showWorld().
5. Text-only answer options never read aloud in city quizzes → read options too (quiz()/readSeq/rdQ), respecting reading-practice levels.

## P2
1. Home: 3 day cards + "משהו אחר" + 4 doors (8 choices) + tappable path steps → doors only inside "משהו אחר"; path icons display-only (home() DOORS ~1281, .dmore ~1265, .tstep2).
2. Tour 10 steps, step 2 describes non-existent path → 3 steps.
3. Companion chosen twice (studio pet + profile favorite animal) → drop one.
4. Level-complete card: 3 buttons + empty grey castle → one "הַבָּא", castle only when a piece revealed (index.html ~1742).
5. World screen: biggest button is purple "אתגר מהיר", avatar overlaps on desktop → small icon / end of world.
6. Map: 11 tappables, all 7 worlds open, no "start here", dimmed "אימון יומי" only plays "no" → hide until available, highlight next world (~1350).
7. Tens lesson picture mirrored (ones left of tens).
8. "אורן המורה" is a form (~23 controls) → default + and תרגיל, hide rest.
9. Day-night slider: no drag hint; "לשאלות" skips interaction.
10. Writing house: 22 letters + primary green button competing.
11. Kingdom: 61 tappables, no placing hint; back from "הגיבור שלי" goes Home instead of kingdom.
12. Parent "היום של אורן": 61 controls, 5–6 buttons per mission row → ✓/✕ per row, rest on row tap or ⚙️; hide kid HUD (gems, music) in parent panel. Also new ⏱️ היום block ~13 buttons → status line + "+15 דק׳" / "+ משימה" + collapsed "עוד אפשרויות".

## P3
Locked studio hats no feedback, 30px swatches; phone 38px HUD icons, 26–30px 🔊; speed challenge two counters; balloons empty chip, all cabinets "✨ חדש"; frog "-1" most prominent; piano shows A S D on touch; one-activity buildings extra tap; tablet column subtraction keypad far left; stale HUD label; real-world mission asks "כמה ערמות?" but only "סיימתי"; badges page dense; together chips 29px; time-lock parent button kid-like; caged-friend icon tiny.

## Works well
Keypad everywhere + desktop typing; entry, story, profile, memory, arcade answers, together step, time lock clear; no overflow, no page errors.

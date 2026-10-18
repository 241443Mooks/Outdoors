# Play recommendation template

> **Purpose:** This is a personal shelf of games worth sharing, not a product catalogue,
> ranking, rules database or conventional review site. Help somebody understand
> **what the game is, what playing it feels like, and whether they might enjoy it**.

The collection grows when a game is genuinely worth mentioning, not to hit a target
number. No ratings, scores, top-ten rankings, sales pitches or pressure to recommend
everything. Keep it warm, specific, honest, conversational and a little understated.

## How to work with a new game

The owner can simply share a **name, link and a few spoken or written impressions**.
Those impressions are enough to start; **do not ask the owner to fill in a form**.

1. **Listen for the distinctive experience.** What do they actually enjoy? Often
   it is not the official mechanism: it might be a beautiful growing landscape,
   plans going wrong, reading people, the tactile pieces, or a shared moment.
   Preserve the concrete details and the reason those details matter.
2. **Check facts separately.** Verify the correct edition, publisher-reported
   player count and approximate duration, and any rules or expansion claims
   using a credible source. If uncertain, leave a detail out or make uncertainty
   explicit. Never present a six-player expansion as part of a four-player base game.
3. **Write in the owner's voice.** Keep their point of view, enthusiasm and
   caveats. Use “I” only for experiences the owner actually described. Do not
   invent plays, favourites, memories, judgements or ownership. Avoid
   generic promotional language and forced superlatives.
4. **Make it useful to a reader.** Explain the central action without reproducing
   a rulebook; show what is fun or frustrating, especially how other players
   change the experience. Help the right person recognise the game.
5. **Prepare one data entry** in `data/play.json`, preserving the existing
   order unless there is a reason to change it. Add appropriate content
   assertions and check the generated listing and game page.
6. **Keep changes on the existing feature PR** until the owner explicitly
   asks to publish. A passing test is not permission to merge.

## Consistent on-site structure

These are the same fields used by the site generator. Consistency is about
**questions answered**, not identical sentences or paragraph lengths.

| Field | Editorial job |
| --- | --- |
| `name` | The correct game title. |
| `strapline` | A brief, memorable line conveying *this* game's distinct appeal. |
| `summary` | One or two clear sentences: the activity and why it is worth a look. Used on the collection card. |
| `theme` | **The theme:** what players do, in plain English. Include just enough mechanics to picture it. |
| `fun` | **What's fun?** The heart of the recommendation: specific first-hand reactions, surprises, tension, beauty, social interactions or decisions, and how it feels as play unfolds. Usually the most personal section. |
| `audience` | **Who might like it?** People and situations the game suits, including welcome accessibility or thinking demands where observed. Be candid about barriers; don't claim “everyone loves it”. |
| `type` | One primary collection filter: `board`, `dice`, or `card`. A tile-laying board game can still have a `tiles` art treatment. |
| `tags` | A handful of useful factual and experiential characteristics. Include verified player count and playtime when possible. No keyword stuffing. |
| `art` | The fallback illustration: `dice`, `cards`, `tiles`, or `abstract`. This is **not** the game type. |
| `amazonUrl` | Optional, exact **game-specific** affiliate URL supplied by the owner. Do not infer, invent or reuse another game's link. |
| `image` | Optional gameplay photo only with verified reuse rights, accessible alt text, source, photographer, licence and change notice. |

### Reusable writing outline

**[Game title]** — [short, distinctive strapline]

**In a sentence:** [what players do and why the experience is interesting]

**The theme** — [what the game involves, its goal and how a turn/round feels;
mention physical components if they matter]

**What's fun?** — [the owner's actual reasons: decisions, emotions, other
players, changing fortunes, tactile or visual pleasures, replayability;
include an illustrative detail instead of a generic compliment]

**Who might like it?** — [the people, group sizes and moods for which it makes
sense, drawing on what the owner has said]

**Practical details** — [one game type, verified players/time, a few useful
tags, and a clear base-game-versus-expansion distinction if needed]

**Link/photo** — [only an owner-supplied game-specific shopping link; only a
photograph with documented reuse rights]

This is an **editorial outline**, not an extra set of HTML sections to add:
the existing game page displays the appropriate fields automatically.

## JSON entry skeleton

Copy this **single object** into `games` in `data/play.json` and replace the
example text before committing. Never publish these placeholders.

```json
{
  "slug": "game-slug",
  "name": "Game title",
  "strapline": "Short line about this game's distinctive appeal.",
  "summary": "What people do and why this might be enjoyable.",
  "theme": "The premise and core activity, explained simply.",
  "fun": "The owner's genuine, specific experience of playing it.",
  "audience": "Who might like it, and why.",
  "tags": [
    "Verified player count",
    "Verified approximate time",
    "Useful game characteristic"
  ],
  "art": "abstract",
  "type": "board"
}
```

Optional fields: add `amazonUrl` **only** when its exact URL was supplied
for this game. Add an `image` object **only** when rights are cleared; the
required photo metadata and permissions register are described in
[Play image sourcing](play-image-sourcing.md) and the [README](../README.md).
The generator already places the affiliate disclosure alongside any
shopping link.

## Before adding or changing a recommendation

- [ ] The reason **the owner likes this particular game** is recognisable.
- [ ] `theme`, `fun` and `audience` answer different questions without
      repeating boilerplate or inventing first-hand experience.
- [ ] Details such as players, duration, mechanisms, base game and expansions
      have been checked; uncertain claims are qualified or omitted.
- [ ] The primary `type` fits the existing filters; the art style is independent.
- [ ] Any Amazon link is for **this** title and variant, and remains optional.
- [ ] Any photograph depicts the game meaningfully, has commercial reuse
      permission and full credit, or the original illustration remains.
- [ ] Add or update tests for the distinctive observations and generated page;
      run `npm run check` or confirm the GitHub checks pass.
- [ ] Keep the work unmerged until the owner explicitly approves publication.

**Above all:** readers should hear a person talking about games they
actually enjoy, not a shop trying to sell them.

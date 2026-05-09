# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HomeworkAI is a Next.js web app that acts as a Socratic homework tutor for Dutch secondary school students. It never gives direct answers — it guides students toward understanding through questions, calibrated to their school level.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`) via `@anthropic-ai/sdk`
- **Storage:** `localStorage` for user profile (no auth, no database)

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Environment

Copy `.env.local.example` to `.env.local` and set `ANTHROPIC_API_KEY`.

## Architecture

```
app/
  page.tsx          # Root: redirects to /setup or /chat based on localStorage
  setup/page.tsx    # Profile creation/edit form
  chat/page.tsx     # Main chat interface with streaming
  api/chat/route.ts # POST endpoint — builds system prompt, streams Claude response
types/
  profile.ts        # UserProfile type, SchoolLevel enum, label/year maps
lib/
  subjects.ts       # Subject lists per school level
  systemPrompt.ts   # Builds the level-aware Socratic system prompt
  profile.ts        # localStorage get/save/clear helpers
```

**User flow:** `/` → check localStorage → `/setup` (first time) or `/chat` (returning user).

**Profile** stores: name, school level (vmbo-b/k/gt, havo, atheneum, gymnasium), year, and selected subjects.

**System prompt** (`lib/systemPrompt.ts`) adapts depth and questioning style by level — vmbo-b gets simple step-by-step guidance, gymnasium gets deep analytical Socratic questioning.

**Chat** (`app/chat/page.tsx`) streams responses via SSE from `/api/chat`. Switching subjects clears the conversation.

## Core Product Principle

The AI must **never give direct answers**. It uses the Socratic method: guiding questions, pointing out errors without correcting them, and scaffolding understanding. This is enforced in the system prompt and must be preserved in any prompt changes.

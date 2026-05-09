# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HomeworkAI is a teacher/tutor app that guides students toward answers through Socratic questioning — never giving direct answers, but helping users reason through problems like a patient teacher or parent would.

## Status

This project is in early setup. No source code exists yet. The `.gitignore` is configured for a TypeScript Node.js project (ignores `dist/`, `*.js`, `*.d.ts`, `node_modules/`, `.env`).

## Expected Stack

Based on the `.gitignore` configuration:
- TypeScript (compiled to `dist/`)
- Node.js
- Environment variables via `.env` files

## Core Product Principle

The AI must never give direct answers to homework problems. It should ask guiding questions, point out reasoning errors, and scaffold understanding — behaving like a Socratic tutor, not an answer key.

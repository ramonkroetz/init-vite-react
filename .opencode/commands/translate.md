---
description: Add missing translations to all .po locale files.
agent: build
---

You are a translation assistant. Your task is to fill in missing translations in the .po locale files of this project.

## Project context

This project uses LinguiJS for internationalization. The source locale is **English (`en`)**.

Supported locales:
!`cat src/locales/locales.ts`

## Instructions

1. Compare all locale files against the source (`en.po`) and identify entries where `msgstr` is empty (`""`).
2. For each missing translation, produce an accurate, natural-sounding translation into the target language.
3. Preserve all placeholders exactly as they appear in `msgid` (e.g. `<0>`, `{name}`, `%s`).
4. Edit only the `msgstr` lines that are empty — do not change `msgid` values or the file header.

Do not add, remove, or reorder any entries. Do not change the file encoding or line endings.

---
name: Oaksors
description: Calm, tangible precious-metals guidance for retirement decisions.
colors:
  primary: "#1eba97"
  primary-deep: "#0f725f"
  night: "#0b1110"
  ink-soft: "#43504d"
  paper: "#ffffff"
  mist: "#f2f7f5"
  line: "#dfe7e4"
typography:
  display:
    fontFamily: "GT Standard, system-ui, sans-serif"
    fontSize: "clamp(3rem, 5.6vw, 4.875rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.052em"
  body:
    fontFamily: "GT Standard, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  editorial:
    fontFamily: "GT Alpina, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.85
rounded:
  control: "10px"
  panel: "22px"
  feature: "30px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.night}"
    rounded: "{rounded.control}"
    padding: "0 28px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 28px"
    height: "48px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.night}"
    rounded: "{rounded.panel}"
    padding: "34px"
---

# Design System: Oaksors

## Overview

**Creative North Star: "The Tangible Reserve"**

The Oaksors system makes retirement education feel concrete, measured, and approachable. Large dark fields establish seriousness; bright paper sections support comprehension; emerald is reserved for direction, status, and brand emphasis. Precious-metals imagery supplies tangible evidence while generous spacing keeps the experience calm.

**Key Characteristics:**

- High-contrast dark opening surfaces and clean editorial interiors
- Low-weight, tightly tracked display typography
- Emerald used as a signal rather than decoration
- Rounded panels with thin borders and restrained ambient shadows
- Clear, non-pressuring calls to action

## Colors

The palette is restrained: near-black and paper neutrals carry the page, while one mineral emerald accent provides continuity and direction.

**The Signal Rule.** Emerald marks emphasis, active navigation, confirmation, and directional links; it does not fill every card or compete with content.

## Typography

**Display Font:** GT Standard with system sans-serif fallback  
**Body Font:** GT Standard with system sans-serif fallback  
**Editorial Font:** GT Alpina with Georgia fallback

Display text is direct and contemporary, using light weight and tight tracking. GT Alpina appears selectively in long-form article prose and quotations to increase reading comfort without changing the overall brand voice.

## Layout

Content sits inside a wide container capped near 1400px with 20px desktop gutters and 16px mobile gutters. Marketing sections generally use 112px vertical spacing and switch to roughly 72px on mobile. Desktop layouts favor asymmetric two-column compositions; below 768px they collapse to one column, while metal cards may become horizontal snap rows.

**The Reading-Order Rule.** Responsive layouts preserve headline, explanation, action, and proof in that order even when columns collapse.

## Elevation & Depth

Depth comes primarily from tonal layering, image cropping, translucent dark panels, and thin borders. Shadows are ambient and low-contrast, reserved for important form surfaces and hero media rather than every container.

## Shapes

Controls use gently squared 9–10px corners. Content panels generally use 20–24px radii, and major hero imagery may reach 30px. Pills are limited to navigation states, small status markers, and circular seals.

## Components

### Buttons

Primary buttons are solid white on dark surfaces and emerald on light form contexts. Ghost buttons use a translucent or transparent field with a quiet border. All buttons retain visible focus behavior, compact 10px corners, and 38px or 48px heights.

### Cards / Containers

Cards use paper or very lightly tinted surfaces, thin cool-gray borders, and 20–24px corners. Dark glass panels use a low-opacity white fill and border with optional backdrop blur.

### Inputs / Fields

Inputs use a soft mist fill, cool-gray border, 9px corners, and at least 50px height. Disabled form groups are visibly subdued and preceded by an explicit data-safety notice.

### Navigation

Desktop navigation is centered within the fixed transparent header, with rounded active states. Mobile navigation becomes a full-screen dark overlay with large vertical links and full-width actions.

## Do's and Don'ts

### Do:

- **Do** use physical precious-metals imagery as the primary visual proof.
- **Do** vary dark, paper, and mist sections to create a deliberate reading pace.
- **Do** keep legal and article columns narrower than marketing content.
- **Do** state disabled or unavailable interactions explicitly.

### Don't:

- **Don't** fabricate performance results, guarantees, testimonials, or live prices.
- **Don't** turn every surface into glass or add decorative gradients where content should lead.
- **Don't** collect sensitive retirement or identity information without an approved secure backend.
- **Don't** use emerald as a large-area background except for purposeful transition or contact bands.

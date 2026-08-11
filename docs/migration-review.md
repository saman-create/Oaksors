# Post-migration review

The React migration intentionally preserves the incumbent Oaksors landing page. The following product and design issues were not changed because they would alter content, behavior, or visual direction:

1. **Qualification form delivery** — the form currently presents fields and a CTA but has no submission endpoint, validation messaging, success state, or privacy consent flow.
2. **Static “live” pricing** — the precious-metals section labels its figures as live market pricing, but the displayed values are hard-coded. It needs a real market-data source or a less time-sensitive label.
3. **Incomplete navigation targets** — the header and footer link to `#news` and `#contact`, but neither anchor exists in the current landing page.
4. **Page weight** — the repository’s original media library is approximately 135 MB. Production delivery would benefit from removing unused assets, responsive image variants, and video/image compression.
5. **Long entrance transitions** — many sections use 1.4-second reveals and some existing motion uses elastic easing. Shorter exponential easing would feel more responsive, but was retained for visual parity.
6. **About-section accent treatment** — the three thick left borders read more like navigation state than editorial structure. A quieter divider or spacing hierarchy would be clearer in a future design pass.

These are deferred recommendations, not migration defects.

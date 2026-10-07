Title: [infra] name the failing field in betterbe validation error messages | Description:

A betterbe ValidationError message holds only the constraint text, e.g. "is longer than expected length 40", so a snapshot or a logged callable error never says which field failed. The error already carries path and key (betterbe 4.1.0).

Change betterbe (github.com/ericvera/betterbe) to prefix the joined path, e.g. source: is longer than expected length 40. Then release it, bump it in Okven, and update every ValidationError inline snapshot across the repo, one file at a time.

A wrapper in Okven would only reach the call sites that remember to use it, so the fix belongs in the library.

Source: Delta Review note on eric/attribution-3, packages/valid/src/functions/trackAttributionEventSchema.test.ts.

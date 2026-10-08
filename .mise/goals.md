Feature: add reason to ValidationError

Problem
ValidationError.message always comes as <path>: <reason>. Callers that already show the path on their own can't get the reason by itself. firebase-kit-admin shows its own Value of '<path>' subject and then adds error.message, so the path appears twice:

Value of 'phone' failed custom validation (error: 'phone: invalid phone number').
The only way around it today is to rebuild betterbe's message prefix and cut it off. That ties callers to how the message is formatted inside betterbe.

What exists today (6.0.0)

The ValidationError constructor sets message from formatMessage(options) (dist/ValidationError.js:37). The prefix it adds (lines 6–15) is:
<pathString>: when the context is value
key <pathString>: when the context is key (record keys, validated in record.js:53)
nothing when pathString is empty (root-level errors)
The public fields are path, key, value, context, constraint, code and pathString. None of them holds just the reason. The test constraint is { code: 'test', data? } and carries no message.
Change

Add a public, read-only reason: string to ValidationError. It is the text message has after the prefix: the same string formatMessage builds now, minus the path part.
Every error code gets reason, not only test.
message does not change.
When there is no prefix (root-level error), reason === message.
Ideally formatMessage builds the reason first and adds the prefix to it, so the two can't get out of sync.
Tests
For each case, check that reason has no prefix and message is unchanged:

a top-level value path
a nested path (a.b)
a record-key test failure (key m.k: prefix)
a root-level test failure
at least one built-in constraint, such as minLength, so it's clear reason isn't specific to test
Release
This is additive, so it's a minor version (6.1.0). Use a feat: commit with no BREAKING CHANGE: footer. Update the ValidationError docs in the README.

Downstream
After 6.1.0 is published, firebase-kit-admin will use error.reason in its case 'test' message and raise its betterbe peer floor to ^6.1.0.

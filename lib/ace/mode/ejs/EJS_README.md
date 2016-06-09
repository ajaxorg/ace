EJS-Lint for Ace Editor

Intended to give more informative error handling on EJS documents.

See ejs-tests.js for use cases

Errors handled:
- Nesting start tags inside tag pairs (e.g. <% <% %>)
- Filter statements that do not contain a |
- Start tags that do not have closing tags
- General javascript errors given for poorly formatted code within successful tags
	- e.g. <%= person( %> will throw an error while <%= person(name) %> will not
	- Intended to give a line number for the error because typical ejs error will not give that to a user

Warnings handled:
- Use of a percentage sign within ejs tags
- Starting a tag with - or :, as that was probably intended to be a filter
- End tags that are not paired with start tags


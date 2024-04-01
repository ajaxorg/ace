### Generating new translation file
- Create a `JSON` file in this folder named `<language_id>.json`.
- Add `{"$id": "<language_id>"}` to the empty file.
- Run `node Makefile.dryice.js nls` in the root of the repository to generate empty translation file.
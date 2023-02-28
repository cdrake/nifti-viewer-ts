## Development
Vite features a host mode to enables development with real time HMR updates directly from the library via the `start` script.

To test your library from within an app:

- **From your library**: run `npm link` or `yarn link` command to register the package
- **From your app**: run `npm link "mylib"` or `yarn link "mylib"` command to use the library inside your app during development


## Development Cleanup

Once development completes, `unlink` both your library and test app projects.

- **From your app**: run `npm link "mylib"` or `yarn link "mylib"` command to use the library inside your app during development
- **From your library**: run `npm unlink` or `yarn unlink` command to register the package


## Release Publishing

Update your `package.json` to next version number, and remember to tag a release.

Once ready to submit your package to the NPM Registry, execute the following tasks via `npm` (or `yarn`):

- `npm run clean` &mdash; Assure a clean build
- `npm run build` &mdash; Build the package
- `npm run build:types` &mdash; Build API Extractor d.ts declaration

Assure the proper npm login:

```
npm login
```

Submit your package to the registry:

```
npm publish --access public
```

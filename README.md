# YouTube-Dashboard
This is an free to use You Tube Analitics Dashboard. There are a few pages. To get a list of these pages, go to page /help. To get an API-key for You Tube, you'll need to make a project on google cloud. I will make a tutorial on this later. For now, just ask chatGPT or something for help if you get stuck.
## Desktop app

Start Xavis Analytics as an Electron desktop app with:

```bash
npm install
npm run desktop
```

Electron starts the existing Node.js/Express server locally in the background and opens the terminal screen. The SQLite database is stored in Electron's per-user data directory, so settings and history remain writable and persistent in the desktop app.

### Updates

Packaged releases check the GitHub repository for new releases and download updates automatically. The update is installed when the app is normally closed and is active the next time it opens. Build a release with:

```bash
npm run dist
```

Publish the generated installer through a GitHub Release in `xavans2/YouTube-Dashboard`. Development runs started with `npm run desktop` do not perform update checks.

Pushes to `main` automatically increment the patch version, create the next `vX.Y.Z` tag, and trigger the desktop release workflow. Each platform is built on its native GitHub Actions runner, including separate macOS Intel (`x64`) and Apple Silicon (`arm64`) builds.

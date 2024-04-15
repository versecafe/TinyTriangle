# Tiny Triangle

For those of us who spend far too much time working with Vercel, or if you just really want a triangle in your top bar, this is the app for you.

![image](https://github.com/versecafe/TinyTriangle/assets/147033096/a7fcd18f-e50a-473b-9721-8ee10d4576c7)

Tiny triangle is a macOS menu bar app for Vercel, it's designed to give you quick access to your projects, settings, extensions, and notifications.

# Features

### Quick Links

**Organizations;** Base level, Settings, Integrations, & Usage.

**Projects;** Base level, Settings, Analytics, Logs, & Deployments.

**User;** Account Settings _Shift S_ & Dashboard _Shift + D_.

### Settings

**Persistant Config;** Save your preferences across reboots.

**Organization & Project Quick Links;** Configure which if any quick links are shown for projects and organizations.

**Token;** Set your Vercel API Token, currently UI for this is under development.

### Other

**Auto Sync;** Automatically resync with Vercel every five minutes in the background.

**Unread Comments;** Icon changes to alert you to any unread comments on your projects and then shows the relevant team with a bell icon.

**Restart & Quit;** Simple utilities for restarting or quitting the application on _CMD + R or Q_.

**Bug Reporting;** Quick open to GitHub issues or support email to report issues.

# Development

## Step 1: Install Dependencies

First you need to install your node dependencies. From the _root_ of TinyTriangle, run the following command:

```bash
bun install
```

Then to configure the pods dependencies for the native macOS code run:

```bash
bunx pod-install
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of TinyTriangle:

```bash
bun start
```

## Step 3: Start tiny Triangle

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of TinyTriangle and run the following command:

```bash
bun macos
```

If everything is set up correctly you should see a small triangle appear in your menu bar which will contain a list of your Vercel projects, your account, and more.

### Troubleshooting

- Confirm you have node 20 or later installed
- Confirm you have Xcode installed
- Make sure you have ruby 3.0.0 or later installed
- Make sure you have bun installed

### Current Issues

- Token needs to be manually set in App.tsx
- Quit does not seem to work reliably
- jest test fails over MacOS only for MenuBar imports

### Future Features

- Notifications _partially supported_
- Token set UI \*
- Multi account support
- Better error handling
- App Icon
- Prebuilt binaries
- Eslint Flat Config

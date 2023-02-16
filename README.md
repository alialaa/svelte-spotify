# SvelteKit Spotify Clone

Code for my [Svelte & SvelteKit Course](https://www.udemy.com/course/svelte-and-sveltekit).

## Running the App Locally

After cloning the repository, run `npm install` to install dependencies.

Then you will need to create a spotify app in your [Spotify Developer Account](https://developer.spotify.com/dashboard/) and grab an ***App ID*** and an ***App Secret***.

Next create a `.env` file in the root folder based on the [`.env.example`](.env.example) file provided.

```env
SPOTIFY_APP_CLIENT_ID=Your Spotify App Client ID
SPOTIFY_APP_CLIENT_SECRET=Your Spotify App Secret Key
SPOTIFY_BASE_URL=https://api.spotify.com/v1
BASE_URL=http://localhost:5173 (You might need to change this if you are running locally on a different port)
```

## Developing

Start a development server by running:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
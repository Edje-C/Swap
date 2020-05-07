# Swap
<img src="/src/client/static/logo.png" width="100" />

## What is Swap?

Swap is a playlist generator.

## How does it work?

Swap pulls music from your Spotify account to create a playlist.

When you create a Swap, you assign a title and a songCount. The songCount will let Swap know how many songs to pull from each collaborator for the playlist.

&nbsp;&nbsp;&nbsp;&nbsp;40% of the songs will be from your saved songs.

&nbsp;&nbsp;&nbsp;&nbsp;40% of the songs will be from your top songs.

&nbsp;&nbsp;&nbsp;&nbsp;20% of the songs will be recommendations.

After you create a Swap, you are given a key which will give collaborators access to your Swap. This key will expire in 24 hours and you will not be able to retrieve it again but you can generated a new one from the Swap details.

When you save a Swap, a playlist is created in your Spotify account and you can find all the collected songs there. After you save a Swap, collaborators will no longer be able to collaborate on that playlist.

## How can I run it locally?

Install the dependencies using `npm i`

Run the program using `npm run dev`

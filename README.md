# 🦓 Zoo

A playground for comparing AI image models.

## Usage

This is a [Next.js](https://nextjs.org/) app. To run it locally, you'll need to install [Node.js](https://nodejs.org/en/).

Install dependencies:

```console
npm install
```

Add your [Replicate API token](https://replicate.com/account#token) to `.env.local`:

```
REPLICATE_API_TOKEN=<your-token-here>
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.


- on client generate a submission ID
- create a prediction with webhook URL set to api/replicate_webhook?submission_id = that submission ID (check scribble). there's a vercel URL thingy I want to differentiate local/prod
- store prediction with submission_id

- fix sizing of outputs
- get images in storage

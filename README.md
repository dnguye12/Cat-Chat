# 👋Cat Chat README

A full-stack chat application built with **Next.js** and the **Mistral AI API**.
<br/>
<br/>
You can test it directly at:<br/>
https://cat-chat-rust.vercel.app/about
<br/><br/>

This project was created as part of my application for an internship in the role of a software engineer in Mistral.

> This README is designed for reviewers. It’s easy to follow, and makes the project straightforward to run and test locally.
<br/>

## 🔧Features
* **Multi-model chat:** Switch between Mistral models at any time.
* **Chat completion**: Talk directly to the module with Mistral Chat Completion API.
* **Persistent history:** Store chats & messages in Postgres database via Drizzle.
* **Edit & re-run:** Edit any message and re-generate.
* **Branching:** Fork a chat at any message, quick branch switching.
* **Voice mode:** Push-to-talk recording, send audio to API, stream TTS back.
* **Image & PDF support:** Upload files and let the model see/read them.
* **UI:** Clean and responsive user interface.
<br>

## 💡Tech Stack
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[MistralAI]: https://img.shields.io/badge/mistralai-FA520F?style=for-the-badge&logo=mistralai&logoColor=white
[Mistral-url]: https://mistral.ai/
[Drizzle]: https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black
[Drizzlel-url]: https://orm.drizzle.team/
[Neon]: https://img.shields.io/badge/neondb-47A248?style=for-the-badge&logo=postgresql&logoColor=white
[Neon-url]: https://neon.com/
[Uploadthing]: https://img.shields.io/badge/uploadthing-FF000F?style=for-the-badge&logo=databricks&logoColor=white
[Uploadthing-url]: https://uploadthing.com/
[ShadCN]: https://img.shields.io/badge/shadcnui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[ShadCN-url]: https://ui.shadcn.com/
* [![Next][Next.js]][Next-url] : NextJS for full-stack development
* [![MistralAI][MistralAI]][Mistral-url] : Mistral AI API
* [![Drizzle][Drizzle]][Drizzlel-url] : Database ORM
* [![Neon][Neon]][Neon-url] : Neon DB for Postgre database
* [![Uploadthing][Uploadthing]][Uploadthing-url] : Handle uploading images and PDF files
* [![ShadCN][ShadCN]][ShadCN-url] :  UI library
<br>

## 📖Getting Started
#### 1) Prerequisites
1.  First clone this repository from github or download it as a zip
```bash
git clone https://github.com/dnguye12/Cat-Chat.git
```
<br/>

1.  Install the packages
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```
<br/>

1. Get a Mistral API Key
Go to https://console.mistral.ai/home
![](https://i.ibb.co/N2ny86Hy/001.png)
Create a new API Key
![](https://i.ibb.co/xtTXkDRZ/002.png)
Copy your new API Key
![](https://i.ibb.co/ZRw9TpSC/003.png)

1. Setup a Neon Database
Create a new Neon DB
![](https://i.ibb.co/rKZ1XL2g/004.png)
Setup the name and location
![](https://i.ibb.co/M51Gcncb/005.png)
Click on one of these to get the database URL
![](https://i.ibb.co/39mH4q5k/006.png)
Copy this URL string
![](https://i.ibb.co/MQzYS82/007.png)

1. Setup  an UploadThing account (optional but for uploading images and files)
Create a new project
![](https://i.ibb.co/yzn1tns/008.png)
Open this tab
![](https://i.ibb.co/95w9n2T/009.png)
Copy your UploadThing API Key
![](https://i.ibb.co/HDRhbGR7/010.png)

#### 2) Environment variables
Create .env at the project root with these variables:
```bash
DATABASE_URL="..."
MISTRAL_API_KEY="..."
UPLOADTHING_TOKEN='...'
```
<br />

#### 3) Prepare database
```bash
# Generate SQL from your Drizzle schema
# npm
npm run drizzle:generate
# yarn
yarn drizzle:generate
# pnpm
pnpm drizzle:generate
# bun
bun run drizzle:generate

# Apply migrations to Neon
# npm
npm run drizzle:push
# yarn
yarn drizzle:push
# pnpm
pnpm drizzle:push
# bun
bun run drizzle:push
```
<br />

#### 4) Run the app
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
<br />

## 🤗Contact Me
My portifolio: https://www.duc-huy.com/
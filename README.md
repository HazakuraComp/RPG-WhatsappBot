# RPG-WhatsappBot

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />

Introducing the WhatsApp RPG bot that supports the Mongo database and can use cases and plugins simultaneously. This is a homemade version by HazakuraComp and the original you can just visit this link https://github.com/ArdSvt/Base-Case-x-Plugins/

Creator: [ArdSvt](https://github.com/ArdSvt)

## Table of Contents 

The following is a complete guide to using or deploying this bot..

[Run With Termux](#RunTermux) - How to run in termux.
[Get URI MongoDB](#UriGet) - How to Get uri Mongo database.

[Run with Heroku](#HerokuRun) - How to run in Heroku.
[Replit Deployment](#1ReplitDeployment) - How to run in replit

## 📦 WhatsApp Bot Dependencies

| Package              | Version    | Description                                                          |
|----------------------|------------|----------------------------------------------------------------------|
| `baileys`            | ^6.x.x     | WhatsApp Web API for multi-device support                            |
| `mongodb`            | ^5.x.x     | MongoDB client for database interaction                              |
| `node-fetch`         | ^3.x.x     | HTTP client (used for API requests like Jikan API, YouTube API)      |
| `chalk`              | ^5.x.x     | Adds terminal color logs                                             |
| `moment`             | ^2.x.x     | Time/date formatting (e.g., cooldowns, daily timestamps)             |
| `pino`               | ^8.x.x     | Lightweight logger                                                   |
| `express`            | ^4.x.x     | (Optional) Web server or keep-alive endpoint                         |
| `dotenv`             | ^16.x.x    | Load environment variables                                           |
| `axios`              | ^1.x.x     | Promise-based HTTP client (alternative to fetch)                     |
| `cheerio`            | ^1.x.x     | HTML parser and scraper (like jQuery)                                |
| `qrcode-terminal`    | ^0.12.x    | Prints QR codes in terminal (used in QR login session)               |
| `form-data`          | ^4.x.x     | Used to send files in HTTP requests (e.g., media uploads)            |
| `fs-extra`           | ^11.x.x    | File system utilities (e.g., `fs.ensureDir`, `fs.writeJson`, etc.)   |

## RunTermux

1. Install Termux to Yor android system.
2. run command `pkg install nodejs` for install the Node.js package.
3. Clone this repository use command `git clone https://github.com/HazakuraComp/Rpg-WhatsappBot`.
4. enter the repository directory using the command `cd RPG-WhatsappBot`.
5. run command `npm install` for installing Dependencies.
6. and run command `npm start` for start the bots.

If you can't use uri or are confused about how to get Mongo db uri you can click on this whatsapp link..
[Whatsapp](https://wa.me/6287756593163)

## UriGet

🔗 Steps to Get URI from MongoDB Atlas

1. **Sign Up / Log In**
   - Visit [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a Cluster**
   - Click “Build a Database” → Choose “Shared” → Select region → Create

3. **Add a Database User**
   - Go to **Database Access** → Add new user
   - Set a username & password
   - Choose role: `Read and write to any database`

4. **Allow Network Access**
   - Go to **Network Access** → Add IP Address → Select `0.0.0.0/0` (Allow from anywhere)

5. **Get Connection URI**
   - Go to **Database** → Click “Connect” → Choose “Connect your application”
   - Copy the URI:
     ```
     mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Paste into `config` File**
   ```env
   MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/?retryWrites=true&w=majority

## HerokuRun

**Heroku Web Deployment Guide**

---
Deploy WhatsApp Bot to Heroku (Web Version)

This guide walks you through deploying your WhatsApp bot to Heroku using the Heroku web interface, without any command line tools.

---

### Requirements

* A [Heroku account](https://heroku.com/)
* A GitHub repository containing the bot code
* A MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

### Step-by-Step Instructions

#### 1. Fork or Upload the Bot to GitHub

If you haven’t already:

* Go to [GitHub](https://github.com)
* Create a new repository
* Upload your WhatsApp bot project or fork an existing one

---

#### 2. Create a New Heroku App

* Visit the [Heroku Dashboard](https://dashboard.heroku.com/apps)
* Click the **New** button → **Create new app**
* Enter a name for your app and choose a region (e.g., United States)

---

#### 3. Connect Heroku to GitHub

* Go to the **Deploy** tab in your Heroku app
* Under **Deployment method**, select **GitHub**
* Authorize Heroku to access your GitHub account (if prompted)
* Search for your repository and click **Connect**

---

#### 4. Add Buildpacks

* Go to the **Settings** tab
* Scroll down to **Buildpacks**
* Click **Add buildpack** and add the following buildpacks in this order:

1. **Node.js**

   ```
   https://buildpack-registry.s3.amazonaws.com/buildpacks/heroku/nodejs.tgz
   ```

2. **FFmpeg** (for audio and video processing)

   ```
   https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
   ```

3. **ImageMagick** (for image/sticker processing)

   ```
   https://github.com/DuckyTeam/heroku-buildpack-imagemagick.git
   ```

After adding them, make sure Node.js is listed first.

---

#### 5. Set Config Vars

* Still in the **Settings** tab, go to **Config Vars**
* Click **Reveal Config Vars** and add the following:

| Key         | Value                                                      |
| ----------- | ---------------------------------------------------------- |
| `MONGO_URI` | Your full MongoDB Atlas connection URI                     |
| `PORT`      | `3000` or leave blank if your app handles it automatically |

Add any other keys that your bot may require (such as API keys, session variables, etc).

---

#### 6. Deploy the Bot

* Return to the **Deploy** tab
* You can either:

  * Click **Enable Automatic Deploys** to redeploy every time you update your GitHub repository, or
  * Click **Deploy Branch** to trigger a manual deployment

---

### Accessing Logs

To monitor the bot's output:

* Go to the **More** menu in the top-right of your app dashboard
* Click **View Logs**

You should see output like:

```
Connected to WhatsApp as: 123456789@s.whatsapp.net
Listening on port: 3000
```

---

### Keeping the Bot Online (Optional)

By default, Heroku free dynos go to sleep after 30 minutes of inactivity.

To prevent this:

* Create an account at [UptimeRobot](https://uptimerobot.com/)
* Set up an HTTP monitor that pings your Heroku app URL every 5 to 10 minutes

---

Let me know if you would like this in PDF or if you need a "Deploy to Heroku" badge or button.

---

## WhatsApp Bot Deployment Methods Overview

| Platform          | OS/Environment        | Persistent | Free Tier           | Auto Restart   | Notes                                  |
| ----------------- | --------------------- | ---------- | ------------------- | -------------- | -------------------------------------- |
| Replit            | Online IDE            | No         | Yes                 | No             | Requires UptimeRobot to stay online    |
| Railway           | Cloud Platform        | Yes        | Yes                 | Yes            | Suitable for long-term bot deployment  |
| GitHub Codespaces | Linux-based container | No         | Yes (limited hours) | No             | Great for development/testing          |
| RDP (Windows)     | Windows               | Yes        | No                  | No (manual)    | Suitable for manual/local server usage |
| Ubuntu VPS        | Linux (Ubuntu)        | Yes        | No                  | Yes (with PM2) | Ideal for production                   |

---

## 1. Replit Deployment

| Step | Description                                                          |
| ---- | -------------------------------------------------------------------- |
| 1    | Create a new Replit project using the **Node.js** template           |
| 2    | Upload your bot source code or use GitHub integration                |
| 3    | Open the **Secrets** tab (environment variables) and add `MONGO_URI` |
| 4    | Make sure `index.js` contains the entry point (`node index.js`)      |
| 5    | Modify `package.json`: set `"start": "node index.js"` in `scripts`   |
| 6    | Click **Run** to launch the bot                                      |

> Note: Use [UptimeRobot](https://uptimerobot.com/) to ping Replit every 5–10 minutes to keep it alive.

---

## 2. Railway Deployment

| Step | Description                                                      |
| ---- | ---------------------------------------------------------------- |
| 1    | Sign in at [https://railway.app/](https://railway.app/)          |
| 2    | Create a new project → Connect your GitHub repository            |
| 3    | Railway will auto-detect and install Node.js dependencies        |
| 4    | Go to the **Variables** tab, add your `MONGO_URI` and other keys |
| 5    | Click **Deploy** or set up automatic deploys from GitHub         |
| 6    | Your bot runs automatically after each deploy                    |

> Ideal for hosting bots with automatic redeploy on commit and persistent uptime.

---

## 3. GitHub Codespaces

| Step | Description                                                          |
| ---- | -------------------------------------------------------------------- |
| 1    | Go to your GitHub repository → Click “Code” → “Open with Codespaces” |
| 2    | Create a new codespace and wait for the container to boot            |
| 3    | Open terminal inside Codespaces and run `npm install`                |
| 4    | Add secrets via `.env` file or set directly via `process.env`        |
| 5    | Run the bot with `node index.js`                                     |

> Good for development. Limited to 60–90 hours per month depending on plan.

---

## 4. RDP (Remote Desktop)

| Step | Description                                      |
| ---- | ------------------------------------------------ |
| 1    | Connect to your Windows RDP instance             |
| 2    | Download and install Node.js and Git             |
| 3    | Clone your repository using Git                  |
| 4    | Install dependencies with `npm install`          |
| 5    | Set environment variables manually or via `.env` |
| 6    | Run the bot with `node index.js`                 |

> Use `pm2` through WSL or keep the RDP session open for persistence.

---

## 5. Ubuntu VPS Deployment

| Step | Description                                                       |
| ---- | ----------------------------------------------------------------- |
| 1    | SSH into your VPS: `ssh root@your_ip`                             |
| 2    | Install dependencies: `apt install nodejs npm git -y`             |
| 3    | Clone the bot repo: `git clone <your-repo>`                       |
| 4    | Navigate into the folder and install: `npm install`               |
| 5    | Add `.env` file or use `export` to set variables                  |
| 6    | Start the bot using `node index.js` or use `pm2` for auto-restart |

### Using PM2 on Ubuntu:

```bash
npm install -g pm2
pm2 start index.js --name whatsapp-bot
pm2 save
pm2 startup
```

> This method is ideal for production environments, provides full control, and enables long-running bots.

---

Let me know if you’d like a downloadable `.md` version of this guide or tailored `.env.example` template for your repository.

## Note

Make sure you fill in a valid MongoDB URI in the config.js file. If you have any issues or questions, feel free to contact the creator.

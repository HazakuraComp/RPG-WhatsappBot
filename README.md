# RPG-WhatsappBot

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />

Introducing the WhatsApp RPG bot that supports the Mongo database and can use cases and plugins simultaneously. This is a homemade version by HazakuraComp and the original you can just visit this link https://github.com/ArdSvt/Base-Case-x-Plugins/

Creator: [ArdSvt](https://github.com/ArdSvt)

## Table of Contents 

The following is a complete guide to using or deploying this bot..

[Run With Termux](#RunTermux) - How to run in termux.
[Get URI MongoDB](#UriGet) - How to Get uri Mongo database.

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

## Note

Make sure you fill in a valid MongoDB URI in the config.js file. If you have any issues or questions, feel free to contact the creator.

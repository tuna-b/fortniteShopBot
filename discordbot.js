const { Client, Intents } = require("discord.js");
const Axios = require('axios');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});


client.on("ready", () => {
  client.user.setActivity("type {help");
  console.log("I am ready!");
});


client.on("messageCreate", (message) => {
  if (message.content.startsWith("{help")) {
    message.channel.send("commands:\n{featured\n{daily\n{specialFeatured");
  } if (message.content.startsWith("{daily")) {
    fortniteStuff("daily", message);
  } if (message.content.startsWith("{featured")) {
    fortniteStuff("featured", message);
  } if (message.content.startsWith("{specialFeatured")) {
    fortniteStuff("specialFeatured", message);
  }
});

client.login("Insert token");

// fortnite shop api code

const fortniteStuff = (shop, message) => {
    const response = Axios.get("https://fortnite-api.com/v2/shop/br").then(
    response => {
        const data = response["data"]["data"];
        const featured = data["featured"];
        const daily = data["daily"];
        const specialFeatured = data["specialFeatured"];
        
        if (shop === "daily") {
            parseFortniteShop(daily, message);
        } else if (shop === "featured") {
            parseFortniteShop(featured, message);
        } else if (shop === 'specialFeatured') {
            parseFortniteShop(specialFeatured, message);
        }
    });
}

// method for parsing each object

const parseFortniteShop = (object, message) => {

    let items = {};
    const entries = object["entries"];
    for (let key in entries) {
        for (let i in entries[key]["items"]) {
            // singular items: 
            if (entries[key]["bundle"] == null) {
                let section = entries[key]["section"]["name"];
                if (items[section] === undefined) {
                    items[section] = [];
                } else {
                    // pushing to interior array of form [item name, price, image] to sectional array of object items
                    items[section].push([entries[key]["items"][i]["name"], entries[key]["finalPrice"], entries[key]["items"][i]["images"]["smallIcon"]]);
                }
            }
            // if i want to add bundles, put else statement and find correct data
        }
    }
    printItems(items, message);
}
// prints items of parsed object, used for debugging
const printItems = (items, message) => {
    for (let key in items) {
        message.channel.send("\n**"+key+"** " + "Collection");
        items[key].forEach(element => {
            message.channel.send(element[2] +"\nItem Name: " + element[0] + "\nPrice: " + element[1]);
        })
        
    }
}
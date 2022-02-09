

require('dotenv').config()
const fs = require('fs');
const { rcon_connect } = require('./rcon_auto_connect.js');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ partials: ['CHANNEL'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const baseport = 34228;
const prefix = `.chat`;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let rcons = {};
const readLastLines = require(`read-last-lines`);
const { networkInterfaces } = require('os');

//array for all ofline servers
let offline_servers = [2, 6, 7, 8]




async function start() {
    
     //instantiate the list of commands 
     client.commands = new Discord.Collection();
     for (const file of commandFiles) {
         //require to file so its loaded
         const command = require(`./commands/${file}`);
         //add it to the list 
         client.commands.set(command.name, command);
     }

    //9 cause 8 < 9 and we want to inculde 8 and we start at 1 cuase theirs no s0
    for (let i = 1; i < 9; i++) {
        //if servers is offline dont try and connect to it
        if (offline_servers.includes(i)) {
            rcons[i] = { "connected": false }
            continue;
        }

        //port starts at baseport 34228 and its it server num so s1 is 34229 etc.
        let port_to_use = baseport + i

        //Use the auto rcon connect
        rcon = await rcon_connect(port_to_use, i)

        //add to the list
        rcons[i] = rcon
    
        
    }
    //start listing for commands
    client.login(process.env.DISCORD_TOKEN);
    
  
}

start().catch((err) => {
    console.log(err)
});

//rcon.send(`test1`);

client.on("ready", () => {
    let date_string = new Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '')     // delete the dot and everything after
    console.log(`${date_string}: I am ready!`)
//    client.channels.cache.get('368727884451545089').send(`Bot logged in - Notice some Servers are set to be offline (#${offline_servers}). To enable the bot for them please edit infoBot.js`); // Bot Spam Channel for ready message. Reports channel is "368812365594230788" for exp // Reports Channel is "764881627893334047" for test server
//    client.channels.cache.get('764881627893334047').send(`Bot logged in - Notice some Servers are set to be offline (#${offline_servers}). To enable the bot for them please edit infoBot.js`); // Bot Spam Channel for ready message. Reports channel is "368812365594230788" for exp // Reports Channel is "764881627893334047" for test server


    //console.log(year + "-" + month + date + " " + hours + ":" + minutes + ":" + seconds + ": I am ready!");
});


client.on("messageCreate", async msg => {

    function internal_error(err) {
        console.log(err)
        msg.channel.send('Internal error in the command. Please contact an admin.')
    }

    //Ends msg early if author is a bot
    const guild = msg.guild;
    if (msg.author.bot) return;

    const args = msg.content;
    //if(msg.channel.id != `940714357480906762`) { return;}//over all game chat channel
    //if(msg.channel.id != `940773478087397386`) { return;} // S1 Thread
    if(msg.channel.id == `940773478087397386`) //S1 Thread
    {
        const commandName = `chat1`;
        //console.log(`${msg.content};`)
        console.log(`S1 Chat Sent`)
        // get the command or its aka
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aka && cmd.aka.includes(commandName));
        // if no command dont do anything
        if (!command) {console.log('!command'); return;}
        runMe (msg,args,rcons,internal_error,command)

    }
    if(msg.channel.id == `940779788103213056`) //S3 Thread
    {
        const commandName = `chat3`;
        //console.log(`${msg.content};`)
        console.log(`S3 Chat Sent`)
        // get the command or its aka
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aka && cmd.aka.includes(commandName));
        // if no command dont do anything
        if (!command) {console.log('!command'); return;}
        runMe (msg,args,rcons,internal_error,command)
    
    }             



    // get the command or its aka
    //const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aka && cmd.aka.includes(commandName));//Moved
    
    //const command = client.commands.get(commandName)
    
    // if no command dont do anything
    //if (!command) {console.log('!command'); return;} // Moved

    // disallows commands in dm's to run as commands in dms if it is set to guild only
    //Don't need DM check anymore because this bot does not have partials so it should not be albe to get any
    

    // only runs if below Guild id's (EXP = `260843215836545025`) 762249085268656178 is testing server

    //should not be needed anymore beauce the commands only run in the threads listed above...
    /*
    if (command.guildOnly && (guild != `762249085268656178` && guild != `260843215836545025`)) {
        console.log(`Not correct guild`);
        return msg.reply(`Wrong guild`);
    }
    */

    // Check to see if you have the role you need or a higher one
    //Open to all memmbers for now...
    /*
    let req_role = command.required_role

    if (req_role) {
        let role = await msg.guild.roles.fetch(req_role)
        let allowed = msg.member.roles.highest.comparePositionTo(role) >= 0;
        if (!allowed) {
            console.log(`Unauthorized `);
            msg.channel.send(`You do not have ${role.name} permission.`);
            return;
        }
    } else if (command.validator) {
        let obj = await command.validator(msg, args, internal_error)
            .catch((err) => { internal_error(err); return })
        if (!obj.success) {
            return msg.channel.send(obj.error)
                .catch((err) => { internal_error(err); return })
        }
    }*/


    // If command requires an argument, decline to run if none is provided. Request arguments in the main export of the command file. 
    //not needed currently I think, pictures basically but not a big deal for now
    /*
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${msg.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix} ${command.name} ${command.usage}\``;
        }
        return msg.channel.send(reply);
    }
    */
    function runMe (msg,args,rcons,internal_error,command)
   {
        try {
            command.execute(msg, args, rcons, internal_error)
                .catch((err) => { internal_error(err); return })
        } catch (error) {
            console.log(error);
            msg.reply(`there was an error trying to execute that command!`);
        }       
    }
})

let s1File= `/home/factorio/servers/eu-01/console.log`;
let s3File= `/home/factorio/servers/eu-03/console.log`;

console.log(`Watching for file changes on ${s1File}`);
console.log(`Watching for file changes on ${s3File}`);

const removeChar = {'`':'\`',"'":'\'','"':'\"','\n':'','\\':'_','/':'nocmd/'};

fs.watch(s1File, (event, chatfrom1) => {
  if (chatfrom1) {
    readLastLines.read(s1File, 1)
        //.then((lines) => client.channels.cache.get('940714357480906762').send(`\`\`\``+lines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+`\`\`\``));
        .then((lines) => client.channels.cache.get('940773478087397386').send(`\`\`\``+lines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+`\`\`\``));
    
    
    console.log(`${chatfrom1} file Changed`);
}
});

fs.watch(s3File, (event, chatfrom3) => {
    if (chatfrom3) {
      readLastLines.read(s3File, 1)
          //.then((lines) => client.channels.cache.get('940779788103213056').send(`\`\`\``+lines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+`\`\`\``));
          .then((lines) => client.channels.cache.get('940779788103213056').send(`\`\`\``+lines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+`\`\`\``));
      
      
      console.log(`${chatfrom3} file Changed`);
  }
  });


// items to replace
// stringRemove = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
// stringReplace = 

//let test
//test = `bob \\\`, test " test." 'test ' / \n\n\\n`;
//test = `\``;
//const removeChar = {'`':'\`',"'":'\'','"':'\"','\n':'','\\':'_','/':'nocmd/'};
//s = test;
//let finallines = lines.replace(/[`'"\n\\/]/g, m => removeChar[m]);
//console.log(s);


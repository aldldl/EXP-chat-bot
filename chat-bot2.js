

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
        rcons = await rcon_connect(port_to_use, i)

        //add to the list
        rcons[i] = rcons
    
        
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

//let s0Thread =`940714357480906762`;
//let s1Thread =`945133048343699516`;

//let s3Thread =`945133117721681940`;
//let s4Thread =`945133134993829908`;
//let s5Thread =`945133153864024125`;

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
    if(msg.channel.id == `940779788103213056`) //S3 Thread 940779788103213056
    {
        const commandName = `chat3`;
        let server = 3;
        //console.log(`${msg.content};`)
        console.log(`S3 Chat Sent`)
        // get the command or its aka
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aka && cmd.aka.includes(commandName));
        // if no command dont do anything
        if (!command) {console.log('!command'); return;}
        runMe (msg,args,rcons,internal_error,command)
    
    }
    if(msg.channel.id == `945133134993829908`) //S4 Thread
    {
        const commandName = `chat4`;
        //console.log(`${msg.content};`)
        console.log(`S4 Chat Sent`)
        // get the command or its aka
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aka && cmd.aka.includes(commandName));
        // if no command dont do anything
        if (!command) {console.log('!command'); return;}
        runMe (msg,args,rcons,internal_error,command)
    
    }     
    if(msg.channel.id == `945133153864024125`) //S5 Thread
    {
        const commandName = `chat5`;
        //console.log(`${msg.content};`)
        console.log(`S5 Chat Sent`)
        // get the command or its aka
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aka && cmd.aka.includes(commandName));
        // if no command dont do anything
        if (!command) {console.log('!command'); return;}
        runMe (msg,args,rcons,internal_error,command)
    
    }                  



   
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
let s4File= `/home/factorio/servers/eu-04/console.log`;
let s5File= `/home/factorio/servers/eu-05/console.log`;

let s1Thread =`945133048343699516`;

let s3Thread =`945133117721681940`;
let s4Thread =`945133134993829908`;
let s5Thread =`945133153864024125`;


console.log(`Watching for file changes on ${s1File} (1)`);
console.log(`Watching for file changes on ${s3File} (3)`);
console.log(`Watching for file changes on ${s4File} (4)`);
console.log(`Watching for file changes on ${s5File} (5)`);


const removeChar = {'`':'_',"'":"\'",'"':'\"','\n':'','\\':'_','/':'nocmd/'};

fs.watch(s1File, (event, chatfrom1) => {
  if (chatfrom1) {
    readLastLines.read(s1File, 1)
        //.then((lines) => client.channels.cache.get('940714357480906762').send(`\`\`\``+lines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+`\`\`\``));
        .then((lines) => client.channels.cache.get(s1Thread).send(`\`\`\``+lines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+`\`\`\``));
    
    
    console.log(`${chatfrom1} file Changed 1`);
}
});

fs.watch(s3File, (event, chatfrom3) => {
    if (chatfrom3) {
      readLastLines.read(s3File, 1)
          .then((lines) => webhooksend(s3File,lines));
      
      console.log(`${chatfrom3} file Changed 3`);
        async function webhooksend(s3File, lines)
        
        {
            const webhooks = await client.channels.cache.get(`940714357480906762`).fetchWebhooks(); // 940714357480906762 (chat channel (not thread))
            const webhook = webhooks.first();
            let catText = lines.split(" ");
            let [timeLines0, timeLines1, timeLines2, webName, ...chaterText] = lines.split(" ");
            let otherLines = chaterText.join(' ')
            let avatarURLnew;
            let imgEmoji;
               
                async function webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines)
                {
                    await webhook.send({
                        content: `${imgEmoji }**${webName}** `+otherLines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+``,
                        username: `EXP Chat-Bot`,
                        avatarURL: avatarURLnew,
                        threadId: s3Thread,
                    }); 
                    //console.log(`${timeLines0}||${timeLines1}||${timeLines2}||${otherLines}`); //Debug lines (remove first comments)
                      
                }
            
            
                if (catText[2] == "[JOIN]") 
                    {
                        avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png'; 
                        imgEmoji = `:wave: `;
                        webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines);
                        
                    } 
                if (catText[2] == "[LEAVE]") 
                {
                    avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png';
                    imgEmoji = `:zzz: `;
                    webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines);
                                  
                } 
                if (catText[2] == "[CHAT]") 
                {
                    avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png';
                    imgEmoji = ``
                    webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines)
                } 
        }
        
  
  
  
    }
  });

  /* 

  fs.watch(s4File, (event, chatfrom4) => {
    if (chatfrom4) {
      readLastLines.read(s4File, 1)
          .then((lines) => webhooksend(s4File,lines));
      
      console.log(`${chatfrom4} file Changed4`);
        async function webhooksend(s4File, lines)
        
        {
            const webhooks = await client.channels.cache.get(`${s0Thread}`).fetchWebhooks();
            const webhook = webhooks.first();
            console.log(s4Thread);
            let catText = lines.split(" ");
            let [timeLines0, timeLines1, timeLines2, webName, ...chaterText] = lines.split(" ");
            let otherLines = chaterText.join(' ')
            let avatarURLnew;
            let imgEmoji;
               
                async function webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines)
                {
                    await webhook.send({
                        content: `${imgEmoji }**${webName}** `+otherLines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+``,
                        username: `EXP Chat-Bot`,
                        avatarURL: avatarURLnew,
                        threadId: s4Thread,
                    }); 
                    //console.log(`${timeLines0}||${timeLines1}||${timeLines2}||${otherLines}`); //Debug lines (remove first comments)
                      
                }
            
            
                if (catText[2] == "[JOIN]") 
                    {
                        avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png'; 
                        imgEmoji = `:wave: `;
                        webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines);
                        
                    } 
                if (catText[2] == "[LEAVE]") 
                {
                    avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png';
                    imgEmoji = `:zzz: `;
                    webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines);
                                  
                } 
                if (catText[2] == "[CHAT]") 
                {
                    avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png';
                    imgEmoji = ``
                    webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines)
                } 
        }
        
  
  
  
    }
  });


  fs.watch(s5File, (event, chatfrom5) => {
    if (chatfrom5) {
      readLastLines.read(s5File, 1)
          .then((lines) => webhooksend(s5File,lines));
      
      console.log(`${chatfrom5} file Changed 5`);
        async function webhooksend(s5File, lines)
        
        {
            const webhooks = await client.channels.cache.get(`${s0Thread}`).fetchWebhooks();
            const webhook = webhooks.first();
            let catText = lines.split(" ");
            let [timeLines0, timeLines1, timeLines2, webName, ...chaterText] = lines.split(" ");
            let otherLines = chaterText.join(' ')
            let avatarURLnew;
            let imgEmoji;
               
                async function webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines)
                {
                    await webhook.send({
                        content: `${imgEmoji }**${webName}** `+otherLines.replace(/[\`'"\n\\/]/g, m => removeChar[m])+``,
                        username: `EXP Chat-Bot`,
                        avatarURL: avatarURLnew,
                        threadId: '940779788103213056',
                    }); 
                    //console.log(`${timeLines0}||${timeLines1}||${timeLines2}||${otherLines}`); //Debug lines (remove first comments)
                      
                }
            
            
                if (catText[2] == "[JOIN]") 
                    {
                        avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png'; 
                        imgEmoji = `:wave: `;
                        webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines);
                        
                    } 
                if (catText[2] == "[LEAVE]") 
                {
                    avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png';
                    imgEmoji = `:zzz: `;
                    webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines);
                                  
                } 
                if (catText[2] == "[CHAT]") 
                {
                    avatarURLnew = 'https://explosivegaming.nl/assets/images/new-exp-logo4deeporangefinalrounded-512x512.png';
                    imgEmoji = ``
                    webHookSendContent(webName, avatarURLnew, imgEmoji, otherLines)
                } 
        }
        
  
  
  
    }
  });
*/

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


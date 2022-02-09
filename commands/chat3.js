
const Discord = require('discord.js');
/**
 * 
 * @param {Number} server 
 * @param {Rcon} rcon 
 * @param {Discord.Message} msg 
*/
//let extra;
let finalargs;
let prefix = process.env.PREFIX;
async function runcommand(server, rcon, finalargs, msg, safeName) {
    if (!rcon.connected) {
        await msg.channel.send(`S${server} is not connected the bot.`)
        return;
    }
    let res = await rcon.send(`/sc local player = game.get_player('${safeName}')local color = player and player.chat_color or {1,1,1} game.print(string.format('%s <s>: %s', '${safeName}', '${finalargs}'), color)`) // Send command to pause the server
    if (!res) { // this command should not get a reply from the server. The command should print on the ingame server though.
        console.log(`${safeName} has chatted S${server}`);
    } else {
        await msg.channel.send(`Command might have failed result: \`\`\` ${res} \`\`\``);
    } 
} 
 
/*
local player = game.get_player(${msg.member.displayName})local color = player and player.chat_color or {1,1,1} game.print(string.format('%s: %s', ${msg.member.displayName}, msg), color)
*/

module.exports = {
    name: 'chat3',
    aka: ['c3'],
    description: 'tests stuff once',
    // guildOnly: true, 
    args: true,
    // helpLevel: 'all',
    usage: `\`<#>\` (Server Number, number only)`,
    async execute(msg, args, rcons, internal_error) {
        
        //const server = Math.floor(Number(args[0]));
        let server = 3;
        const removeChar = {'`':'‘',"'":'‘','"':'‘‘','\n':'','\\':'_','/':'_'};
        const removeChar2 = {'`':'‘',"'":'‘','"':'‘‘','\n':'','\\':'_','/':'_'};
        finalargs = args.replace(/[`'"\n\\/]/g, m => removeChar[m]);
        let safeName = msg.member.displayName.replace(/[`'"\n\\/]/g, mm => removeChar2[mm]);

        //let finalargs
            // now an internal check ^^ shouldn't really be needed
            if (!server) {
                msg.channel.send('Please pick a server first just a number (1-8)')
                    .catch((err) => { internal_error(err); return });
                return;
        }
        //msg.delete(1000);// deletes the message in the channel, places it from log
        runcommand(server, rcons[server], finalargs, msg, safeName) // runs the coomand
            .catch((err) => { internal_error(err); return }); // catches issues?
            
        
    },
};



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
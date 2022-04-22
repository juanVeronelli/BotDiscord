
if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

//Discord.js Constantes
const { Client, Intents, MessageEmbed,} = require('discord.js');
const client = new Client({
    restTimeOffset:0,
    partials: ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "USER", "GUILD_SCHEDULED_EVENT"],
    intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})


//Funciones
const controller = require('./utils/controller')
const game = require('./utils/game')
const cooldown = require('./utils/cooldown')

async function verifiedRegister(message){
    const usuario = await controller.check(message.author.username)
    if(usuario === null) {
        message.channel.send('Antes debes registrarte')
        return null
    }
}

//Cooldowns
let hunt_cooldowns = new Set();
let explore_cooldowns = new Set();



// Base de datos
const url = process.env.SV
const db = require('./utils/db');


//Prefix Del Bot
const prefix = '!';

//Evento Ready
client.once("ready", async (Bot)=>{
    console.log(`El bot ${Bot.user.username} esta listo!`);
    client.user.setActivity({
        type: 'WATCHING',
        name: "Server"
    })
    console.log('*******************************************************')
    await db(url)
})
//comandos
client.on("messageCreate", async (message)=>{
    if(message.content.startsWith(prefix) && !message.author.bot){

        // Argumentos del Command
        const args = message.content.slice(prefix.length).trim().split(/ +g/);
        const cmd = args.shift().toLowerCase();

        //*** AYUDAS ***//

        if(cmd === "help" || cmd === "h") {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "BOT"
                })
                .setTitle("HELP VIEW")
                .setDescription("Para los comandos siempre hay algunos atajos que hacen mas simple y rapido el juego, escirbiendo la primera letra de cada comando se puede agilizar la utilizacion del bot ej: !h para !help (solo en comandos de ayuda)")
                .addField("comandos", "escirbe !command o !cmd")
            message.channel.send({embeds:[embed]});
        } if( cmd === "command" || cmd === "cmd"){
            const embed = new MessageEmbed()
                .setTitle("Comandos")
                .setColor("GREEN")
                .addField("Register", "!regsiter", true)
                .addField("profile", "!profile", true)
                .addField("help", "!help", true)
                .addField("hunt", "!hunt", true)
                .addField("explore", "!explore", true)
                .addField("boss", "!boss", true)
                .addField("swords shop", "!shop s", true)
                .addField("health shop", "!shop h", true)
            message.channel.send({embeds:[embed]});
        }
        // ***COMANDOS DE PERFILES*** //

        if(cmd === "register" || cmd === "r"){
            const usuario = await controller.check(message.author.username)
            if(usuario === null){
                controller.addUser(message.author.username, [], 200, 0, 100, 2);
                message.channel.send('Usuario Registrado exitosamente')
            } else if( usuario !== null) message.channel.send('registro fallido, Ya estabas registrado')    
        } if (cmd === "profile" || cmd === "p") {
            let verified = await verifiedRegister(message)
            if(verified !== null) {
                let user = await controller.getUser(message.author.username)
                const embed = new MessageEmbed()
                    .setTitle("PROFILE")
                    .setDescription(`se pueden ver todas las estadisticas de los usuarios`)
                    .setThumbnail(message.author.avatarURL())
                    .setColor("GREEN")
                    .addField("Name", `${user[0].user}`)
                    .addField("Statistics", `
                    Health: ${user[0].statistics.health}
                    Power: ${user[0].statistics.power}
                    Level: ${user[0].statistics.level}
                    Money: ${user[0].statistics.money}
                `)
                message.channel.send({embeds:[embed]});
            }
        }
        //************************************************ COMANDOS DE RPG *******************************************/
        //****Pvp****/
        if(cmd === "hunt") {
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const usuario = await controller.getUser(message.author.username)
                if(cooldown.verified(message.author.id, hunt_cooldowns)){
                    let response = await game.hunt(usuario[0]);
                    message.channel.send(response);
                    // cooldown.cooldownMain(message.author.id, hunt_cooldowns, 300000); // Cooldown del comando
                } else {
                    message.reply('Lo siento pero estas ejecutando el comando demasiado rapido, espera 5 minutos')
                }
            }
        }
        if(cmd === "explore"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const usuario = await controller.getUser(message.author.username)
                if(cooldown.verified(message.author.id, explore_cooldowns)){
                    let response = await game.explore(usuario[0])
                    message.channel.send(response)
                    cooldown.cooldownMain(message.author.id, explore_cooldowns, 600000);
                } else return message.reply('Lo siento pero estas ejecutando el comando demasiado rapido, espera 10 minutos')
            }
        }

        //BOSS LEVEL 0
        if( cmd === "boss"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const usuario = await controller.getUser(message.author.username);
                switch (usuario[0].statistics.level){
                    case 0: return message.channel.send(await game.finalBoss(usuario[0], 0));
                    case 1: message.channel.send('Estamos trabajando en ello! coming soon');
                }
            }
        }


        //****Shop****/
        if(cmd === "shop swords" || cmd === "shop s"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                let embed = new MessageEmbed()
                .setAuthor("HERRERO")
                .setColor("DARK_GREEN")
                .setTitle(" SWORDS SHOP")
                .addField("( +45 👊 ) Diamond Sword", "400 💰 !buy diamond sowrd")
                .addField("( +20 👊 ) Iron Sword", "280 💰 !buy iron sword")
                .addField("( +7 👊 ) Terracota Sword", "140 💰 !buy terracota sword")
                message.channel.send({embeds:[embed]});
            }
        }
        if(cmd === "buy diamond sword"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const user = await controller.getUser(message.author.username);
                let response = await game.buySword(user[0], "diamond sword");
                message.reply(response);
            }
        } else if( cmd === "buy iron sword"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const user = await controller.getUser(message.author.username);
                let response = await game.buySword(user[0], "iron sword");
                message.reply(response);
            }
        }else if( cmd === "buy terracota sword"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const user = await controller.getUser(message.author.username);
                let response = await game.buySword(user[0], "terracota sword");
                message.reply(response);
            }
        }
        if(cmd === "shop Health" || cmd === "shop h"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                let embed = new MessageEmbed()
                .setAuthor("MEDICO")
                .setColor("DARK_GREEN")
                .setTitle(" HEALTH SHOP")
                .addField("( +20 ♥️ ) Medical Kit", "100 💰 !buy medical kit")
                .addField("( +50 ♥️ ) Candy Of Life", "170 💰 !buy candy")
                .addField("( +90 ♥️ ) Health Potion", "350 💰 !buy health potion")
                message.channel.send({embeds:[embed]});
            }
        } else if(cmd === "buy medical kit"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const user = await controller.getUser(message.author.username);
                let response = await game.buyHealth(user[0], "Medical Kit");
                message.reply(response);
            }
        } else if( cmd === "buy candy"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const user = await controller.getUser(message.author.username);
                let response = await game.buyHealth(user[0], "Candy Of Life");
                message.reply(response);
            }  
        } else if(cmd === "buy health potion"){
            let verified = await verifiedRegister(message)
            if(verified !== null){
                const user = await controller.getUser(message.author.username);
                let response = await game.buyHealth(user[0], "Health Potion");
                message.reply(response);
            }  
        }
    }
})



client.login(process.env.TOKEN);
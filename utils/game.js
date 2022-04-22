const controller = require('./controller')

class mob {
    constructor (name, health, power, coins){
        this.name = name,
        this.health = health
        this.power = power
        this.coins = coins
    }
}

class elementos {
    constructor (name, price, healthPlus, powerPlus){
        this.name = name,
        this.price = price,
        this.healthPlus = healthPlus,
        this.powerPlus = powerPlus
    }
}

// RPG Elementos
let diamondSword = new elementos("diamond sword", 400, 0, 45)
let ironSword = new elementos("iron sword", 280, 0, 20)
let terracotaSowrd = new elementos("terracota sword", 140, 0, 7)

//healt Elementos
let medicalKit = new elementos("Medical Kit", 100, 20, 0)
let healthPotion = new elementos("Health Potion", 350, 90, 0) 
let candyOfLife = new elementos("Candy Of Life", 170, 50, 0) 


//MOBS Hunt
let spider = new mob("spider", 100 , 10, 7)
let zombie = new mob("zombie", 100, 15, 7)
let giant = new mob("giant", 100, 45, 20)
let cyclop = new mob("cyclop", 130, 10, 7)
let zioty = new mob("Zioty", 60, 10, 7)
let karak = new mob("Karak", 100, 25, 14)
let ratamon = new mob("Ratamon", 80, 35, 18)

//Mobs Explore
let levering = new mob("Levering Kurer", 200, 50, 30)
let Fenrir = new mob(" Fenrir,", 130, 80, 50)
let Jörmungandr = new mob(" Jörmungandr", 300, 40, 30)
let Sleipnir = new mob("Sleipnir", 120, 30, 20)
let Yggdrasil = new mob("Levering Kurer", 400, 50, 40)


const hunt = async (user) => {
    let mobs = [spider,zombie,zioty,giant,cyclop,karak,ratamon]
    let mob = mobs[Math.floor(Math.random() * mobs.length)];
    if(user.statistics.health > mob.power){
        if(user.statistics.power >= mob.health){
            await controller.addMoney(user, user.statistics, mob.coins * 2 )
            return `${user.user} ha matado a un/a ${mob.name} de 1 solo golpe, (+ ${mob.coins * 2} 💰 )(- 0 ♥️ ) `
        } else {
            let random = Math.floor(Math.random() * 20)
            if(random === Math.floor(Math.random() * 20)){
                await controller.addMoney(user, user.statistics, mob.coins)
                return `${user.user} ha tenido mucha suerte y ${mob.name} no le ha hecho ningun daño (+ ${mob.coins} 💰 )`
            } else {
                await controller.loseHealth(user, user.statistics, mob.power)
                await controller.addMoney(user, user.statistics, mob.coins)
                return `${user.user} ha matado a un/a ${mob.name} (+ ${mob.coins} 💰 ) (- ${mob.power} ♥️ )`
            }
        }
    } else {
        await controller.deathUser(user, user.statistics);
        return `${user.user} ha muerto a manos de un/a ${mob.name}, (- ${ Math.floor(user.statistics.money / 2) } 💰)`
    }   
}

const explore = async (user) =>{
    let mobs = [Fenrir,Jörmungandr,Sleipnir,Yggdrasil, levering]
    let mob = mobs[Math.floor(Math.random() * mobs.length)];
    if(user.statistics.health > mob.power){
        if(user.statistics.power >= mob.health){
            await controller.addMoney(user, user.statistics, mob.coins * 2 )
            return `${user.user} ha matado a un/a ${mob.name} de 1 solo golpe, (+ ${mob.coins * 2} 💰 )(- 0 ♥️ ) `
        } else {
            await controller.loseHealth(user, user.statistics, mob.power)
            await controller.addMoney(user, user.statistics, mob.coins)
            return `${user.user} ha matado a un/a ${mob.name} (+ ${mob.coins} 💰 ) (- ${mob.power} ♥️ )`
        }
    } else {
        await controller.deathUser(user, user.statistics);
        return `${user.user} ha muerto a manos de un/a ${mob.name}, (- ${user.statistics.money / 2} 💰)`
    }   
}

const finalBoss = async (user, level) => {
    if(level === 0){
        let finalBoss = {
            health: 600,
            power: 400,
            coins: 1000
        };
        if(user.statistics.power >= finalBoss.health){
            controller.upgradeLevel(user, level + 1);
            return `Felicidades ahora eres lvl 1`
        } else {
            return ` Aun te falta adquirir poder para vencer al boss`
        }
    }


}

const buySword = async (user, elemento) =>{
    let elementos = [diamondSword, ironSword, terracotaSowrd];
    let element = elementos.find(x => x.name === elemento );
    if(element.price > user.statistics.money){
        return `No puedes pagar este item`
    } else if(element.price <= user.statistics.money ) {
        await controller.addElements(user, user.statistics, element);
        return `${user.user} ha comprado ${element.name} por ${element.price} 💰 `
    }
}

const buyHealth = async (user, elemento) =>{
    let elementos = [candyOfLife,healthPotion,medicalKit];
    let element = elementos.find(x => x.name === elemento);
    if(element.price >user.statistics.money){
        return `No puedes pagar este item`
    } else if(element.price <= user.statistics.money){
        if((user.statistics.health + element.healthPlus) > 100){
            let health = 100 - user.statistics.health
            await controller.addElements(user, user.statistics, element, health);
            return `${user.user} ah recuperado ${health} ♥️`
        } else {
            await controller.addElements(user, user.statistics, element, element.healthPlus);
            return `${user.user} ah recuperado ${element.healthPlus} ♥️`
        }
    }
}

module.exports = {
    hunt,
    explore,
    buySword,
    buyHealth,
    finalBoss
}
//Model
const model = require('./model')

exports.addUser = (user, inventory, money, level, health, power ) => {
    const User = {
        "user": user,
        "inventory": inventory,
        "statistics": {
            "health": health,
            "power": power,
            "level": level,
            "money": money
        }
    }
    const newUser = new model(User)
    newUser.save();
}

exports.check = async (user) =>{
    const existe = await model.exists({
            user: user
        })
    return existe
}

exports.getUser = async (user) => {
    const usuario = await model.find({
        user:user
    })
    return usuario
}

// FUNCIONES RPG

exports.upgradeLevel = async (user, level) => {
    return model.updateOne({_id: user._id }, {
        $set: {"statistics.level": level}
    })
}

exports.deathUser = async (user, statistics) => {
    let health = 100
    switch(statistics.level){
        case 0: health = 100; break;
        case 1: health = 150; break;
        case 2: health = 300; break;
        case 3: health = 400; break;
        case 4: health = 600; break;
        case 5: health = 800; break;
    }
    return model.updateOne({_id: user._id}, {$set:{"statistics.health": health, "statistics.money": ( Math.floor(statistics.money / 2))}})
}

exports.loseHealth = (user, statistics, loseLife) =>{
    return model.updateOne(
        {_id: user._id } ,  
        { $set:{"statistics.health": (statistics.health - loseLife)} })
}

exports.addMoney = (user, statistics, money) => {
    return model.updateOne(
        {_id: user._id}, 
        {$set: {"statistics.money":(statistics.money + money)}})
}

// funciones shop

exports.addElements = async (user, statistics, element, health) => {
    return model.updateOne({_id: user._id}, {
        $set:{
            "statistics.money": statistics.money - element.price,
            "statistics.health": statistics.health + health,
            "statistics.power": statistics.power + element.powerPlus
        }
    })
}

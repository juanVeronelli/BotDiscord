function verified(user, cooldownList){
    if(cooldownList.has(user)) return false; else return true 
}

function cooldownMain(user, cooldownList, time){
    cooldownList.add(user);
    setTimeout(()=>{
        cooldownList.delete(user);
    }, time)
}


module.exports = {
    verified,
    cooldownMain
}
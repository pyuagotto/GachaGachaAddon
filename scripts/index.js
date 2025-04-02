//@ts-check
import { Block, Player, system, world, ItemStack } from '@minecraft/server';
import { MinecraftItemTypes } from './lib/index.js';

const options = {
    pitch: 1.5,
    volume: 0.5,
};

/**
 * @param {Block} block
 * @param {Player} player
 */
const pon = function(block, player){
    const loc = {
        x: block.location.x + 0.5,
        y: block.location.y + 1,
        z: block.location.z + 0.5,
    };

    player.sendMessage("ガチャガチャ...");

    let count = 0;
    const playsound = system.runInterval(()=>{
        player.playSound("random.pop",options);
        count++;

        if(count > 6){
            system.clearRun(playsound);
        }
    },3);

    const particle = system.runInterval(()=>{
        player.dimension.spawnParticle("minecraft:end_chest",loc);
    },1);
    
    system.runTimeout(()=>{
        system.clearRun(particle);
        player.sendMessage("ポン！");
        player.playSound("random.levelup",options);

        for(let i = 0;i < 30; i++){
            let [ randomItem ] = Object.values(MinecraftItemTypes).sort(() => 0.5 - Math.random());

            const itemStack = new ItemStack(randomItem,1);
            
            try{
                player.dimension.spawnItem(itemStack,loc);
            }catch{
                //
            }
        }
    },40);
};

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { block, itemStack, player, isFirstEvent } = ev;
    
    if(itemStack === undefined && block.typeId === "minecraft:netherreactor" && isFirstEvent) {
        system.run(()=>{
            block.setType("minecraft:air");
            pon(block,player);
        });
    }
});
export default function allAbilities(arg){
    const abilities = {
        meleeattack : {
            damage: 10,
            speed: 1000,
            range: 30,
            rangecheck: function(self, target){
                const sx = self.x;
                const sy = self.y;
                const tx = target.x;
                const ty = target.y;
                const distance = Math.sqrt((sx-tx)**2 + (sy-ty)**2)
                if (distance < this.range)
                    return true
                return false;
            },
            execute: function(self, target){
                if (this.rangecheck(self, target)){
                    target.currenthp -= this.damage;
                    if (target.currenthp < 0) 
                        target.currenthp = 0;
                }
            }
        }    
    }
    return abilities[arg]
}
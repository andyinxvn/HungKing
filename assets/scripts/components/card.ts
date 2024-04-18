import { _decorator, Component, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('card')
export class card extends Component {
    @property({type:Node})
    back:Node | null = null;
    @property({type:Node})
    icon:Node | null = null;
    cardIdx = 0;
    posIdx = 0 ;//position of card on board
    init(spBack:SpriteFrame, spIcon:SpriteFrame,cardIdx:number,posIdx:number){
        this.back.getComponent(Sprite).spriteFrame = spBack;
        this.icon.getComponent(Sprite).spriteFrame = spIcon;
        this.icon.active = false;
        this.back.active = true;
        this.cardIdx = cardIdx;
        this.posIdx = posIdx;
    }
    openCard(){
        this.back.active = true;
        if(this.icon.active){
            this.icon.active = false;
        }
        tween(this.back).to(0.3,{scale:new Vec3(-1,1,1)})
        .call(()=>{
            this.back.active = false;
            this.icon.active = true;
        }).start()
    }
    closeCard(){
        this.icon.active = true;
        if(this.back.active){
            this.back.active = false;
        }
        tween(this.icon).to(0.3,{scale:new Vec3(-1,1,1)})
        .call(()=>{
            this.back.active = true;
            this.icon.active = false;
        }).start()
    }
    hideCard(){
        this.node.active = false;
    }
    // update(deltaTime: number) {
        
    // }
}



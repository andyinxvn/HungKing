import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('card')
export class card extends Component {
    @property({type:Node})
    back:Node | null = null;
    @property({type:Node})
    icon:Node | null = null;

    init(spBack:SpriteFrame, spIcon:SpriteFrame){
        this.back.getComponent(Sprite).spriteFrame = spBack;
        this.icon.getComponent(Sprite).spriteFrame = spIcon;
        this.icon.active = false;
    }
    // update(deltaTime: number) {
        
    // }
}



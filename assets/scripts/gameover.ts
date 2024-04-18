import { _decorator, Component, Node, Button, Animation } from 'cc';
import { AudioMgr } from './core/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('gameover')
export class gameover extends Component {
    @property({type:Node})
    popup:Node
    @property({type:Node})
    btnRestart:Node | null = null;
    @property({type:Node})
    btnClose:Node | null = null;
    cb:(iCommand:number)=>void
    init(cb:(iCommand:number)=>void){
        this.cb = cb;
    }
    protected start(): void {
        this.btnRestart.on(Button.EventType.CLICK, this.onClick, this);
        this.btnClose.on(Button.EventType.CLICK, this.onClick, this);
    }
    onClick(button: Button) {
        AudioMgr.inst.playSound('click')
        switch (button.node.name) {
            case 'btnRestart':
                this.cb(1);
                this.hide();
                break;
            case 'btnClose':
                this.cb(2);
                break;
        }
    }
    show(){
        this.node.active = true;
        this.popup.getComponent(Animation).play('popup-show');
    }
    hide(){
        this.popup.getComponent(Animation).play('popup-hide');
        let timeout = setTimeout(()=>{
            clearTimeout(timeout);
            this.node.active = false;
        },200)
    }
}



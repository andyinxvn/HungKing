import { _decorator, Component, Node, Label, Button, director } from 'cc';
import { AudioMgr } from './core/AudioMgr';
import GameMgr from './core/GameMgr';
const { ccclass, property } = _decorator;

@ccclass('gameplay')
export class gameplay extends Component {
    @property({ type: Node })
    btnHome: Node | null = null
    @property({ type: Node })
    btnSound: Node | null = null
    @property({ type: Label })
    lbMatches: Label | null = null;
    @property({ type: Label })
    lbTurns: Label | null = null;
    start() {
        //sound
        AudioMgr.inst.playBgm();
        this.updateSoundButton();

        //add listener
        this.btnHome.on(Button.EventType.CLICK, this.onClick, this);
        this.btnSound.on(Button.EventType.CLICK, this.onClick, this);

        //--
        this.reloadGameInfo();
    }
    onClick(button: Button) {
        AudioMgr.inst.playSound('click')
        switch (button.node.name) {
            case 'btnHome':
                director.loadScene('home');
                break;
            case 'btnSound':
                AudioMgr.inst.soundToggle();
                this.updateSoundButton();
                break;
        }
    }
    updateSoundButton(){
        if(AudioMgr.inst.iSoundOn){
            this.btnSound.children[0].active = true;
            this.btnSound.children[1].active = false;
        } else {
            this.btnSound.children[0].active = false;
            this.btnSound.children[1].active = true;
        }
    }
    reloadGameInfo(){
        this.lbTurns.string = `${GameMgr.inst.gameData.turn}`;
        this.lbMatches.string = `${GameMgr.inst.gameData.match}`;
    }
    update(deltaTime: number) {
        
    }
}



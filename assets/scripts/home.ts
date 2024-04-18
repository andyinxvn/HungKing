import { _decorator, AudioClip, Button, Component, director, Label, Node } from 'cc';
import { AudioMgr } from './core/AudioMgr';
import GameMgr from './core/GameMgr';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {
    @property({type:Node})
    btnPlay:Node | null = null
    @property({type:Label})
    lbBestScore:Label | null = null;
    @property([AudioClip])
    audioClips:AudioClip[] = [];
    start() {
        //init sounds
        if(AudioMgr.inst.audioClips.length<1){
            AudioMgr.inst.init(this.audioClips);
        }
        AudioMgr.inst.playBgm();
        //add listener
        this.btnPlay.on(Button.EventType.CLICK, this.onClick, this);

        //load best score
        if(GameMgr.inst.gameData.bestScore > 0){
            this.lbBestScore.string = `${GameMgr.inst.gameData.bestScore}`;
        } else {
            this.lbBestScore.node.parent.active = false;
        }
    }

    onClick(button: Button) {
        AudioMgr.inst.playSound('click')
        switch (button.node.name) {
            case 'btnPlay':
                director.loadScene('gameplay');
                break;
        }
    }
}



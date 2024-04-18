import { _decorator, AudioClip, Button, Component, director, Label, Node } from 'cc';
import { AudioMgr } from './core/AudioMgr';
import GameMgr from './core/GameMgr';
const { ccclass, property } = _decorator;

@ccclass('home')
export class home extends Component {
    @property({ type: Node })
    btnPlay: Node | null = null
    @property({ type: Label })
    lbBestScore: Label | null = null;
    @property({type:Node})
    btnResume:Node | null = null;
    @property([AudioClip])
    audioClips: AudioClip[] = [];
    start() {
        //init sounds
        if (AudioMgr.inst.audioClips.length < 1) {
            AudioMgr.inst.init(this.audioClips);
        }
        AudioMgr.inst.playBgm();
        
        //add listener
        this.btnPlay.on(Button.EventType.CLICK, this.onClick, this);
        this.btnResume.on(Button.EventType.CLICK, this.onClick, this);

        //load level
        this.lbBestScore.string = `LEVEL: ${GameMgr.inst.gameData.level}`;

        //--resume game
        if (GameMgr.inst.gameData.turn > 0) {
            this.btnResume.active = true;
        } else {
            this.btnResume.active = false;
        }
    }

    onClick(button: Button) {
        AudioMgr.inst.playSound('click')
        switch (button.node.name) {
            case 'btnPlay':
                director.loadScene('gameplay');
                break;
            case 'btnResume':
                director.loadScene('gameplay');
                break;
        }
    }
}



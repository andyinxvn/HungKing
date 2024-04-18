import { _decorator, Component, Node, Label, Button, director, Prefab, UITransform, instantiate, Layout, Size } from 'cc';
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

    //--gameplay
    @property({ type: Node })
    board: Node | null = null;
    @property({ type: Prefab })
    pfCard: Prefab | null = null;
    start() {
        //sound
        AudioMgr.inst.playBgm();
        this.updateSoundButton();

        //add listener
        this.btnHome.on(Button.EventType.CLICK, this.onClick, this);
        this.btnSound.on(Button.EventType.CLICK, this.onClick, this);

        //--
        this.reloadGameInfo();
        this.loadGameLevel();
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
    updateSoundButton() {
        if (AudioMgr.inst.iSoundOn) {
            this.btnSound.children[0].active = true;
            this.btnSound.children[1].active = false;
        } else {
            this.btnSound.children[0].active = false;
            this.btnSound.children[1].active = true;
        }
    }
    reloadGameInfo() {
        this.lbTurns.string = `${GameMgr.inst.gameData.turn}`;
        this.lbMatches.string = `${GameMgr.inst.gameData.match}`;
    }
    loadGameLevel() {
        //set size of board
        let levelData = GameMgr.inst.gameLevels[GameMgr.inst.gameData.level - 1];
        let w = this.getComponent(UITransform).width;
        let h = this.getComponent(UITransform).height;
        let boardW = w * 3 / 5;
        let boardH = h * 9 / 10;
        this.board.getComponent(UITransform).setContentSize(boardW, boardH);

        //compute item size
        this.board.removeAllChildren();
        let row = levelData.length;
        let col = levelData[0].length;
        let maxRC = row > col ? row : col;
        let minSize = boardW > boardH ? boardH : boardW;
        let itemSize = (minSize / maxRC)*0.8;
        let spaceW = (boardW - itemSize * col) / (col + 1);
        let spaceH = (boardH - itemSize * row) / (row + 1);
        this.board.getComponent(Layout).spacingX = spaceW;
        this.board.getComponent(Layout).spacingY = spaceH;
        this.board.getComponent(Layout).paddingLeft = spaceW;
        this.board.getComponent(Layout).paddingTop = spaceH;
        for (let i = 0; i < levelData.length; i++) {
            let rowData = levelData[i];
            for (let j = 0; j < rowData.length; j++) {
                let colData = rowData[j];
                let item = instantiate(this.pfCard);
                item.getComponent(UITransform).setContentSize(itemSize, itemSize);
                this.board.addChild(item);
            }
        }
    }
    // update(deltaTime: number) {

    // }
}



import { _decorator, Component, Node, Label, Button, director, Prefab, UITransform, instantiate, Layout, Size, SpriteFrame, Game } from 'cc';
import { AudioMgr } from './core/AudioMgr';
import GameMgr from './core/GameMgr';
import { card } from './components/card';
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

    @property([SpriteFrame])
    sfCardBacks:SpriteFrame[] = []
    @property([SpriteFrame])
    sfCards:SpriteFrame[] = []
    previousCard = -1 //previous cardid
    previousPos  = -1;
    start() {
        //sound
        AudioMgr.inst.playBgm();
        this.updateSoundButton();

        //add listener
        this.btnHome.on(Button.EventType.CLICK, this.onClick, this);
        this.btnSound.on(Button.EventType.CLICK, this.onClick, this);

        //--
        this.prepareGameLevel();//prepare data before load
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

    prepareGameLevel(){
        let level = GameMgr.inst.gameData.level;
        let data = GameMgr.inst.gameLevels[level - 1];

        //--set card back idx
        GameMgr.inst.gameData.back = level % this.sfCardBacks.length;

        //--set card idx
        GameMgr.inst.gameData.table = [];
        for(let i=0;i<data.row;i++){
            let arr = [];
            for(let j=0;j<data.col;j++){
                let idx = GameMgr.inst.getRandomInt(0,this.sfCards.length-1);
                arr.push(idx);
            }
            GameMgr.inst.gameData.table.push(arr);
        }
    }
    loadGameLevel() {
        //--info
        this.lbTurns.string = `${GameMgr.inst.gameData.turn}`;
        this.lbMatches.string = `${GameMgr.inst.gameData.match}`;

        //set size of board
        let level = GameMgr.inst.gameData.level;
        let row = GameMgr.inst.gameLevels[level - 1].row;
        let col = GameMgr.inst.gameLevels[level - 1].col;
        let w = this.getComponent(UITransform).width;
        let h = this.getComponent(UITransform).height;
        let boardW = w * 3 / 5;
        let boardH = h * 9 / 10;
        this.board.getComponent(UITransform).setContentSize(boardW, boardH);

        //compute item size
        this.board.removeAllChildren();
        let maxRC = row > col ? row : col;
        let minSize = boardW > boardH ? boardH : boardW;
        let itemSize = (minSize / maxRC)*0.8;
        let spaceW = (boardW - itemSize * col) / (col + 1);
        let spaceH = (boardH - itemSize * row) / (row + 1);
        this.board.getComponent(Layout).spacingX = spaceW;
        this.board.getComponent(Layout).spacingY = spaceH;
        this.board.getComponent(Layout).paddingLeft = spaceW;
        this.board.getComponent(Layout).paddingTop = spaceH;

        //--
        let table = GameMgr.inst.gameData.table;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let item = instantiate(this.pfCard);
                item.getComponent(UITransform).setContentSize(itemSize, itemSize);
                
                let sfBack = this.sfCardBacks[GameMgr.inst.gameData.back];
                let cardIdx= table[i][j];
                let sfCard = this.sfCards[cardIdx];
                item.getComponent(card).init(sfBack,sfCard,cardIdx,this.board.children.length);
                //--add click event
                item.on(Button.EventType.CLICK, this.onCard, this);
                this.board.addChild(item);
            }
        }
    }
    onCard(button: Button) {
        AudioMgr.inst.playSound('click')
        let cardIdx = button.node.getComponent(card).cardIdx;
        let posIdx  = button.node.getComponent(card).posIdx;

        //--
        if(this.previousCard===-1){
            this.previousCard = cardIdx;
            this.previousPos  = posIdx;
            button.node.getComponent(card).openCard();
        } else {
            if(cardIdx === this.previousCard) {//match
                this.board.children[this.previousPos].getComponent(card).hideCard();
                this.board.children[posIdx].getComponent(card).hideCard();
                GameMgr.inst.gameData.match++;
                this.lbMatches.string = `${GameMgr.inst.gameData.match}`;
            } else {//not match
                this.board.children[this.previousPos].getComponent(card).closeCard();
                this.previousCard = -1;
                this.previousPos = -1;
            }
        }
        GameMgr.inst.gameData.turn++;
        this.lbTurns.string = `${GameMgr.inst.gameData.turn}`;
    }
    // update(deltaTime: number) {

    // }
}



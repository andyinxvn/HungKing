import { Joint2D, _decorator,sys } from 'cc';
class GameMgr {
    private static _inst: GameMgr;
    static get inst () {
        if (this._inst) {
            return this._inst;
        }
        this._inst = new GameMgr();
        return this._inst;
    }
    //--game data
    private readonly GAME_DATA = "GAME_DATA";
    gameData = {
        score:0,
        bestScore:0,
        table:[
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
    }
    saveData(){
        sys.localStorage.setItem(this.GAME_DATA,JSON.stringify(this.gameData));
    }
    readData(){
        let val = sys.localStorage.getItem(this.GAME_DATA);
        if(val!=null){
            this.gameData = JSON.parse(val);
        }
        else {
            this.saveData();
        }
    }

    //--number anims
    public numberWithCommas(n:number) {
        if (n) {
            var result = (n = parseInt(n.toString())).toString().split(".");
            return result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."),
            result.join(".")
        }
        return "0"
    }
    public getOnlyNumberInString(t) {
        var e = t.match(/\d+/g);
        return e ? e.join("") : ""
    }
    public shuffle(array: any){ 
        for (let i = array.length - 1; i > 0; i--) { 
          const j = Math.floor(Math.random() * (i + 1)); 
          [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    }
    public numberTo(obj, start, end, duration){
        clearInterval(obj.timer);
        var range = end - start;
        var minTimer = 50;
        var stepTime = Math.abs(Math.floor(duration / range));
        stepTime = Math.max(stepTime, minTimer);
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        let self = this;
        obj.timer = setInterval(function(){
            if (!!obj.node) {
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = (end - (remaining * range));
                obj.string = self.numberWithCommas(value);
                if (value == end) {
                    clearInterval(obj.timer);
                }
            }else clearInterval(obj.timer);
        }, stepTime);
    }
    
    public getRandomInt(min:number, max:number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
}

export default GameMgr;
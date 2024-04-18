//AudioMgr.ts
import { Node, AudioSource, AudioClip, sys, director } from 'cc';
export class AudioMgr {
    private static _inst: AudioMgr;
    public static get inst(): AudioMgr {
        if (this._inst == null) {
            this._inst = new AudioMgr();
        }
        return this._inst;
    }
    //--main bgm
    bgm: AudioSource = null;
    bgmNode: Node = null;

    iSoundOn = 1;
    audioClips: AudioClip[] = [];
    private readonly SOUND_DATA = 'SOUND_DATA';
    init(arr:AudioClip[]){
        this.audioClips = arr;
        this.bgm.clip = this.audioClips[0];
    }
    soundToggle() {
        if (this.iSoundOn) {
            this.iSoundOn = 0;
            this.bgm.stop();
        } else {
            this.iSoundOn = 1
            this.bgm.play();
        }
    }

    constructor() {
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';
        director.getScene().addChild(audioMgr);
        director.addPersistRootNode(audioMgr);

        //add bg music
        this.bgmNode = new Node();
        this.bgm = this.bgmNode.addComponent(AudioSource);
        audioMgr.addChild(this.bgmNode);

        //--read save file
        this.readData();

    }

    readData() {
        let val = sys.localStorage.getItem(this.SOUND_DATA);
        if (val != null) {
            this.iSoundOn = parseInt(val);
        } else {
            this.iSoundOn = 1
            this.saveData();
        }
    }

    saveData() {
        sys.localStorage.setItem(this.SOUND_DATA, `${this.iSoundOn}`);
    }

    playOneShot(sound: AudioClip | string, volume: number = 1.0) {
        if (!this.iSoundOn) return;
        if (sound instanceof AudioClip) {
            this.bgm.playOneShot(sound, volume);
        }
    }
    playBgm() {
        if (!this.iSoundOn) return;
        if (this.bgm.playing) {
            this.bgm.volume = 1;
        } else {
            this.bgm.play();
        }
    }
    playSound(soundName: string) {
        switch (soundName) {
            case 'click':
                this.playOneShot(this.audioClips[1]);
                break;
            case 'wrong':
                this.playOneShot(this.audioClips[2]);
                break;
            case 'matching':
                this.playOneShot(this.audioClips[3]);
                break;
            case 'lost':
                this.playOneShot(this.audioClips[4]);
                break;
            case 'win':
                this.playOneShot(this.audioClips[5]);
                break;

        }
    }
}
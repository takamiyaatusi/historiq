type historiqOptions<T> = {
    maxIdx: number
    errorAtOverMax: boolean
    defaultValue?: T
}

const _defaultValue = Symbol("defaultValue")

class Historiq<T> {
    private data: T[] = []
    private topIdx: number = 0;
    private currentIdx: number = 0;
    private defaultValue: T | symbol = _defaultValue

    private options: historiqOptions<T> = {
        maxIdx: Number.MAX_SAFE_INTEGER,
        errorAtOverMax: false,
    }

    constructor(options: Partial<historiqOptions<T>> = {}) {
        this.options = { ...options, ...this.options }
        if ("defaultValue" in this.options) {
            this.init(this.options.defaultValue as T)
        } else {
            console.log("Historiq: You must init() with any value!")
        }
    }

    init(defaultValue: T) {
        if (this.defaultValue === _defaultValue) {
            this.data[0] = defaultValue
            this.defaultValue = defaultValue
        }
        return this;
    }
    reset() {
        this.data = []
        this.topIdx = 0
        this.currentIdx = 0
        this.defaultValue = _defaultValue
    }
    // 現在の履歴を取得
    getCurrent() {
        this.guardNoDefault()
        let current = this.defaultValue;
        if (!this.isEmpty()) {
            current = this.data[this.currentIdx];
        }
        return current as T;
    }
    // 履歴を追加（frontはidxの位置まで巻き戻す）
    add(item: T) {
        if (this.isMaxIdx()) {
            if (this.options.errorAtOverMax) {
                throw new Error("Historiq: History index reached MaxIdx. You cannot add any more item!")
            } else {
                console.warn("Historiq: History index reached MaxIdx. You cannot add any more item!")
                return;    
            }
        }
        this.guardNoDefault()
        this.currentIdx += 1;
        this.topIdx = this.currentIdx;
        this.data[this.currentIdx] = item;
    }
    // 一つ前に履歴を戻す
    backward() {
        this.guardNoDefault()
        if (!this.canBackward()) {
            throw new Error("Historiq: There is no older history item!")
        }
        this.currentIdx -= 1;
        return this.data[this.currentIdx];
    }
    // 1つ履歴を進める
    forward() {
        this.guardNoDefault()
        if (!this.canForward()) {
            throw new Error("Historiq: There is no newer history item!")
        }
        this.currentIdx += 1;
        return this.data[this.currentIdx];
    }

    // 現在の履歴を上書きする
    overwrite(item: T) {
        this.guardNoDefault()
        this.data[this.currentIdx] = item;
    }
    // 履歴があるか
    isEmpty() {
        return (this.topIdx === 0);
    }
    // 後に戻れるか
    canBackward() {
        return (this.currentIdx > 0);
    }
    // 前に進めるか
    canForward() {
        return (this.currentIdx < this.topIdx);
    }
    // 
    private isMaxIdx() {
        return this.currentIdx === this.options.maxIdx
    }
    // 
    private guardNoDefault() {
        if (!this.initialized(this.defaultValue)) {
            throw new Error("Historiq: You must init() with any value!")
        }
    }

    private initialized(d: T | symbol): d is T {
        return (d !== _defaultValue)
    }
}

export default function historiq<T>(options: historiqOptions<T>) {
    return new Historiq<T>(options)
}

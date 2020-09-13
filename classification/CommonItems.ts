export interface IItem {
    item: any;
    rate: number;
}

export class CommonItems {
    private _ItemProto: IItem = {item:null, rate:0};
    private _itemsMaxSize: number; get ItemsMaxSize():number{return this._itemsMaxSize};
    private _Items: IItem[] = []; get Items():IItem[]{return this._Items};
    private _numberOfItems: number; get NumberOfItems():number{return this._numberOfItems};

    constructor(Items: IItem[], itemsMaxSize?: number);
    constructor(Items: any[], itemsMaxSize?: number);
    constructor(Items: any[], itemsMaxSize?: number){
        let isIItemInstance: boolean = true;
        this._itemsMaxSize = itemsMaxSize || 0;
        if((!itemsMaxSize) || (Items.length <= itemsMaxSize)) {
            for(let item of Items){
                if(!this.isIItem(item)){isIItemInstance = false; break;}
            }
            this._Items = (isIItemInstance)? Items : Items.map((i)=>{return this.buildItem(i)});
            this._numberOfItems = this._Items.length;
        }
    }
    
    //#region PRIVATE METHODS
    private buildItem(Item: any, rate?:number): IItem {
        let obj: IItem = Object.create(this._ItemProto); obj.item = Item; obj.rate = rate | 0;
        return obj;
    }

    private isIItem(Item: any): boolean {
        let i = Object.getOwnPropertyNames(Item);
        return (Item.isPrototypeOf(this._ItemProto) || (i.length === 2 && i[0] === "item" && i[1] === "rate" && typeof Item.rate === "number"));
    }
    //#endregion

    //#region PUBLIC METHODS
    public indexOfItem(Item: any): number {
        for(let item of this._Items) {
            if(Item === item.item)
                return this._Items.indexOf(item);
        }
        return -1;
    }

    //Mutates the [_Items] object
    public orderByRate(desc?: boolean): void {
        let compareRate = function(a: IItem, b: IItem) {
            if(!desc) return (a.rate > b.rate)? -1 : 1; /*else*/ return (a.rate > b.rate)? 1 : -1;
        }; 
        if(this._Items)
            this._Items.sort(compareRate);
    }

    //Mutates the [_Items] object
    public orderByContent(): void | Error;
    public orderByContent(predicate: (a: IItem, b: IItem)=>(1 | -1)): void | Error;
    public orderByContent(desc: boolean): void | Error;
    public orderByContent(param?: ((a: IItem, b: IItem)=>(1 | -1)) | boolean): void | Error {
        if(typeof param === "function")
            try { this._Items.sort(param) } catch(error) { throw new Error("The given function for sorting IItems has encountered some problems:" + error) }
        else
            this._Items.sort(function(a:IItem, b:IItem){
                if(!param) return (a.item > b.item)? 1 : -1; /*else*/ return (a.item > b.item)? -1 : 1;
            });
    }

    //Mutates the [_Items] & [_numberOfItems] objects
    public insertItem(Item: any): void | Error {
        if(Item) {
            let i: number = this.indexOfItem(Item);
            if(i == -1) {
                if(this._Items.length < this._itemsMaxSize || !this._itemsMaxSize)
                    { this._numberOfItems = this._Items.push({item: Item, rate: 1}); return }
                throw Error("Collection overflowed! It already achieved it maximum size!");
            }
            this._Items[i].rate += 1;
        }
    }

    //Mutates the [_Items] & [_numberOfItems] objects
    public removeItem(Item: any): void {
        let i: number = this.indexOfItem(Item);
        if(this._Items[i].item === Item) {
            this._Items.splice(i, 1);
            this._numberOfItems -= 1;
        }
    }
    //#endregion

    //#region other Accessors
    public get OnlyContent():any[]{return this._Items.map((i)=>{return i.item})};
    //#endregion
}

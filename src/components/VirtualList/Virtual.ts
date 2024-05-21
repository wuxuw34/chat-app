import {DIRECTION_TYPE, IRange, IVirtualList} from "@/components/VirtualList/props.ts";

export default class Virtual {
    private params: IVirtualList & {
        keys: object,
    };
    private callUpdate: any;
    private range: IRange;
    sizes: Map<string, number>;
    private offset: number;
    private updateCount: number;
     direction: string;
    private buffer: number;
    private oldDataSourcesLength: number;
    private oldCurrentIndex: number;

    constructor(params: IVirtualList, callUpdate: any) {
        this.init(params, callUpdate)
    }

    init(params: any, callUpdate: any) {
        this.updateCount = 0
        this.params = params
        this.params.keys = Object.create(null)
        this.callUpdate = callUpdate
        this.range = Object.create(null)
        this.offset = 0
        this.sizes = new Map()
        let start = 0, end = params.keeps - 1
        this.updateOldDataSourcesLength()
        if (params.fromEnd) {
            start = params.dataSources.length - params.keeps - 1
            end = params.dataSources.length - 1
        }
        if (params) {
            this.checkRange(start, end)
        }
        if (params.isBottom) {
            this.setBottom()
        }
    }

    handleScroll(offset: number) {
        const direction = offset > this.offset ? DIRECTION_TYPE.BEHIND : DIRECTION_TYPE.FRONT
        if (direction === DIRECTION_TYPE.FRONT) {
            this.handleFront(offset)
        } else if (direction === DIRECTION_TYPE.BEHIND) {
            this.handleBehind()
        }
    }

    updateDataSources(dataSource: any[]) {
        this.updateBuffer(dataSource.length - this.oldDataSourcesLength)
        this.updateOldDataSourcesLength()
        this.handleDataSourcesChange()
    }

    getSize(id: string) {
        return this.sizes.get(id)
    }

    handleFront(offset: number) {
        this.direction = DIRECTION_TYPE.FRONT
        const currentIndex = this.getCurrentIndex()
        this.checkRange(currentIndex, this.getEndByStart(currentIndex))
    }

    handleBehind() {
        this.direction = DIRECTION_TYPE.BEHIND
        const currentIndex = this.getCurrentIndex()
        this.checkRange(currentIndex, this.getEndByStart(currentIndex))
    }

    handleDataSourcesChange() {
        let start = this.range.start
        if (this.isFront()) {
            start = start + this.buffer
        } else if (this.isBehind()) {
            start = start - this.buffer
        }
        start = Math.max(start, 0)
        this.updateRange(this.range.start, this.getEndByStart(start))
    }

    isFront() {
        return this.direction === DIRECTION_TYPE.FRONT
    }

    isBehind() {
        return this.direction === DIRECTION_TYPE.BEHIND
    }

    updateBuffer(buffer: number) {
        this.buffer = buffer
    }

    updateOldDataSourcesLength() {
        const length = this.params.dataSources.length
        if (length) {
            this.oldDataSourcesLength = length
        } else {
            this.oldDataSourcesLength = 0
        }
    }

    setOldCurrentIndex(index: number) {
        this.oldCurrentIndex = index
    }

    getOldCurrentIndex() {
        return this.oldCurrentIndex
    }

    /**
     *  获取当前offset处索引
     */
    getCurrentIndex() {
        const offset = this.offset
        let low = 0
        let high = this.params.dataSources.length
        let middle = 0
        let middleOffset = 0
        let i = 0

        while (low <= high) {
            middle = low + Math.floor((high - low) / 2);
            middleOffset = this.getIndexOffset(middle);

            if (middleOffset === offset) {
                this.setOldCurrentIndex(middle)
                return middle
            } else if (middleOffset < offset) {
                low = middle + 1
            } else if (middleOffset > offset) {
                high = middle - 1
            }
            i++
        }
        this.setOldCurrentIndex(low > 0 ? low : 0)
        return low > 0 ? low : 0
    }

    /**
     *  索引处偏移
     * @param index
     */
    getIndexOffset(index: number) {
        let offset = 0
        for (let i = 0; i < index; i++) {
            const indexSize = this.sizes.get(this.params.dataKey(this.params.dataSources[i])) as number | undefined
            offset += (typeof indexSize === 'number' ? indexSize : 42)
        }
        return offset
    }

    /**
     *  根据start索引获取end索引
     * @param index
     */
    getEndByStart(index: number) {
        return Math.min(index + this.params.keeps - 1, this.getLastIndex())
    }

    saveSizes(id: any, size: number) {
        this.sizes.set(id, size)
    }

    setOffset(offset: number) {
        this.updateRange(offset, offset + this.params.keeps - 1)
    }

    setBottom() {
        this.setOffset(this.params.dataSources.length - this.params.keeps)
    }

    getRange(): IRange {
        const range: IRange = Object.create(null)
        range.start = this.range.start
        range.end = this.range.end
        range.padFront = this.range.padFront
        range.padBehind = this.range.padBehind
        return range
    }

    updateRange(start: number, end: number) {
        this.range.start = start
        this.range.end = end
        this.range.padFront = this.getPadFront()
        this.range.padBehind = this.getPadBehind()
        this.updateCount++
        this.callUpdate(this.range, this.buffer,this.direction)
    }

    getPadFront() {
        const start = this.range.start
        if (start - this.params.overscan >= 0) {
            return start - this.params.overscan
        } else {
            return 0
        }
    }

    getPadBehind() {
        const end = this.range.end
        if (end + this.params.overscan >= this.params.dataSources.length - 1) {
            return this.params.dataSources.length - 1
        } else {
            return end + this.params.overscan
        }
    }

    getLastIndex() {
        return this.params.dataSources.length - 1
    }

    checkRange(start: number, end: number) {
        const keeps = this.params.keeps
        const total = this.params.dataSources.length

        if (total <= keeps) {
            start = 0
            end = this.getLastIndex()
        } else if (end - start > keeps - 1) {
            end = end - keeps + 1
        }

        if (this.range.start != start) {
            this.updateRange(start, end)
        }
    }


}
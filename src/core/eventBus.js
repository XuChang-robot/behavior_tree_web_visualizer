/**
 * 事件总线模块
 * 用于模块间通信
 */

class EventBus {
    constructor() {
        this.events = new Map();
    }

    /**
     * 订阅事件
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }

        this.events.get(event).add(callback);

        return () => {
            this.off(event, callback);
        };
    }

    /**
     * 取消订阅
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {*} data - 事件数据
     */
    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Event handler error for ${event}:`, error);
                }
            });
        }
    }

    /**
     * 只订阅一次
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    once(event, callback) {
        const onceCallback = (data) => {
            this.off(event, onceCallback);
            callback(data);
        };
        this.on(event, onceCallback);
    }
}

// 定义标准事件
export const Events = {
    // 图数据事件
    GRAPH_LOADED: 'graph:loaded',
    GRAPH_CLEARED: 'graph:cleared',
    NODE_ADDED: 'node:added',
    NODE_UPDATED: 'node:updated',
    NODE_REMOVED: 'node:removed',

    // 交互事件
    NODE_CLICKED: 'node:clicked',
    NODE_DRAG_START: 'node:drag:start',
    NODE_DRAG: 'node:drag',
    NODE_DRAG_END: 'node:drag:end',

    // 视图事件
    VIEW_TRANSFORM: 'view:transform',
    VIEW_ZOOM: 'view:zoom',
    VIEW_PAN: 'view:pan',

    // 导出事件
    EXPORT_SVG: 'export:svg',
    EXPORT_PNG: 'export:png',

    // 布局事件
    LAYOUT_START: 'layout:start',
    LAYOUT_END: 'layout:end',

    // 错误事件
    ERROR: 'error'
};

// 导出单例
export const eventBus = new EventBus();
export default eventBus;
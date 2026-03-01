/**
 * 状态管理模块
 * 集中管理应用状态
 */

class StateManager {
    constructor() {
        this.state = {
            // 图数据
            graph: {
                nodes: [],
                links: []
            },

            // 视图状态
            view: {
                scale: 1,
                translateX: 0,
                translateY: 0,
                width: 0,
                height: 0
            },

            // 交互状态
            interaction: {
                selectedNode: null,
                draggedNode: null,
                isDragging: false,
                moveChildrenWithParent: true
            },

            // 渲染状态
            render: {
                svg: null,
                g: null,
                linkGroup: null,
                nodeGroup: null,
                zoom: null
            }
        };

        this.listeners = new Map();
    }

    /**
     * 获取状态
     * @param {string} path - 状态路径
     * @returns {*} 状态值
     */
    get(path) {
        const keys = path.split('.');
        let value = this.state;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }

        return value;
    }

    /**
     * 设置状态
     * @param {string} path - 状态路径
     * @param {*} value - 新值
     */
    set(path, value) {
        const keys = path.split('.');
        let target = this.state;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in target)) {
                target[key] = {};
            }
            target = target[key];
        }

        const oldValue = target[keys[keys.length - 1]];
        target[keys[keys.length - 1]] = value;

        // 触发监听器
        this._notify(path, value, oldValue);
    }

    /**
     * 订阅状态变化
     * @param {string} path - 状态路径
     * @param {Function} callback - 回调函数
     * @returns {Function} 取消订阅函数
     */
    subscribe(path, callback) {
        if (!this.listeners.has(path)) {
            this.listeners.set(path, new Set());
        }

        this.listeners.get(path).add(callback);

        return () => {
            this.listeners.get(path).delete(callback);
        };
    }

    /**
     * 通知监听器
     * @private
     */
    _notify(path, newValue, oldValue) {
        // 通知精确路径的监听器
        if (this.listeners.has(path)) {
            this.listeners.get(path).forEach(callback => {
                callback(newValue, oldValue, path);
            });
        }

        // 通知父路径的监听器
        const keys = path.split('.');
        for (let i = keys.length - 1; i > 0; i--) {
            const parentPath = keys.slice(0, i).join('.');
            if (this.listeners.has(parentPath)) {
                this.listeners.get(parentPath).forEach(callback => {
                    callback(this.get(parentPath), null, parentPath);
                });
            }
        }
    }

    /**
     * 设置图数据
     * @param {Object} data - { nodes, links }
     */
    setGraphData(data) {
        this.state.graph = {
            nodes: data.nodes || [],
            links: data.links || []
        };
        this._notify('graph', this.state.graph, null);
    }

    /**
     * 获取图数据
     * @returns {Object} { nodes, links }
     */
    getGraphData() {
        return this.state.graph;
    }

    /**
     * 更新节点
     * @param {string} nodeId - 节点ID
     * @param {Object} updates - 更新属性
     */
    updateNode(nodeId, updates) {
        const node = this.state.graph.nodes.find(n => n.id === nodeId);
        if (node) {
            Object.assign(node, updates);
            this._notify('graph.nodes', this.state.graph.nodes, null);
        }
    }

    /**
     * 设置视图变换
     * @param {number} scale - 缩放比例
     * @param {number} x - X偏移
     * @param {number} y - Y偏移
     */
    setViewTransform(scale, x, y) {
        this.state.view.scale = scale;
        this.state.view.translateX = x;
        this.state.view.translateY = y;
        this._notify('view', this.state.view, null);
    }

    /**
     * 重置状态
     */
    reset() {
        this.state.graph.nodes = [];
        this.state.graph.links = [];
        this.state.interaction.selectedNode = null;
        this.state.interaction.draggedNode = null;
        this.state.interaction.isDragging = false;
        this._notify('graph', this.state.graph, null);
    }
}

// 导出单例
export const state = new StateManager();
export default state;
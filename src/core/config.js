/**
 * 配置管理模块
 * 集中管理所有可配置参数
 */

export const config = {
    // 画布配置
    canvas: {
        defaultWidth: 1000,
        defaultHeight: 800,
        backgroundColor: '#f0f2f5'
    },

    // 节点配置
    node: {
        defaultWidth: 100,
        defaultHeight: 50,
        minWidth: 100,
        padding: {
            horizontal: 30,      // 水平边距
            vertical: 10         // 垂直边距
        },
        extraWidth: {
            parallelogram: 60    // 平行四边形额外宽度
        },
        cornerRadius: 5,
        anchorRadius: 2.5,
        anchorColors: {
            top: '#2196F3',      // 顶部锚点颜色
            bottom: '#2196F3'    // 底部锚点颜色
        }
    },

    // 文字配置
    text: {
        fontFamily: 'SimHei, Microsoft YaHei, sans-serif',
        fontSize: 12,
        charWidth: {
            chinese: 12,         // 中文字符宽度
            english: 6           // 英文字符宽度
        }
    },

    // 布局配置
    layout: {
        levelHeight: 100,        // 层级间距
        siblingSpacing: 20,      // 兄弟节点间距
        subtreeSpacing: 40       // 子树间距
    },

    // 连接线配置
    link: {
        strokeWidth: 2,
        arrowSize: 6,
        curveTension: 0.5        // 贝塞尔曲线张力
    },

    // 缩放配置
    zoom: {
        minScale: 0.1,
        maxScale: 4,
        wheelDelta: 0.1,         // 普通滚轮缩放步长
        ctrlWheelDelta: 0.5      // Ctrl+滚轮缩放步长
    },

    // 碰撞检测配置
    collision: {
        padding: 20,             // 碰撞检测边距
        repulsion: 30            // 排斥距离
    },

    // 颜色配置
    colors: {
        defaultNode: 'gray',
        stroke: '#333',
        text: '#333',
        selection: '#2196F3'
    },

    // 形状映射
    shapes: {
        box: 'rectangle',
        rectangle: 'rectangle',
        ellipse: 'ellipse',
        circle: 'ellipse',
        diamond: 'diamond',
        parallelogram: 'parallelogram'
    }
};

/**
 * 获取配置值
 * @param {string} path - 配置路径，如 'node.defaultWidth'
 * @param {*} defaultValue - 默认值
 * @returns {*} 配置值
 */
export function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = config;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }

    return value;
}

/**
 * 更新配置
 * @param {string} path - 配置路径
 * @param {*} value - 新值
 */
export function setConfig(path, value) {
    const keys = path.split('.');
    let target = config;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in target)) {
            target[key] = {};
        }
        target = target[key];
    }

    target[keys[keys.length - 1]] = value;
}

export default config;
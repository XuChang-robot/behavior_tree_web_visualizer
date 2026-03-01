/**
 * SVG导出模块
 * 完全按照app.js的实现方式
 */

import { eventBus, Events } from '../core/eventBus.js';
import { state } from '../core/state.js';

/**
 * 计算整个树的边界
 * 从state中的节点数据获取位置
 * @returns {Object} { minX, minY, maxX, maxY }
 */
function calculateTreeBounds() {
    const nodes = state.get('graph.nodes');
    
    if (!nodes || nodes.length === 0) {
        return {
            minX: 0,
            minY: 0,
            maxX: 1000,
            maxY: 800
        };
    }

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    nodes.forEach(node => {
        // 确保节点有x、y、width和height属性
        const x = node.x || 0;
        const y = node.y || 0;
        const width = node.width || 120;
        const height = node.height || 50;
        
        // 增加缓冲区
        const nodeLeft = x - width / 2 - 40;
        const nodeRight = x + width / 2 + 40;
        const nodeTop = y - height / 2 - 40;
        const nodeBottom = y + height / 2 + 40;

        minX = Math.min(minX, nodeLeft);
        minY = Math.min(minY, nodeTop);
        maxX = Math.max(maxX, nodeRight);
        maxY = Math.max(maxY, nodeBottom);
    });

    // 确保边界值不是Infinity
    if (minX === Infinity) {
        minX = 0;
        maxX = 1000;
        minY = 0;
        maxY = 800;
    }

    return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    };
}

/**
 * 导出为SVG
 * 完全按照app.js的实现方式
 * @param {string} filename - 文件名（不含扩展名）
 */
export function exportAsSVG(filename = 'behavior_tree') {
    try {
        const svgElement = document.querySelector('svg');
        if (!svgElement) {
            throw new Error('未找到SVG元素');
        }

        // 计算整个树的边界
        const bounds = calculateTreeBounds();
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;

        // 创建一个新的SVG元素，包含整个树
        const svgCopy = svgElement.cloneNode(true);

        // 移除viewBox，设置明确的宽高
        svgCopy.removeAttribute('viewBox');
        svgCopy.setAttribute('width', width);
        svgCopy.setAttribute('height', height);

        // 调整g元素的位置，使整个树居中
        const gElement = svgCopy.querySelector('g');
        if (gElement) {
            // 移除当前的transform，将树移动到原点
            gElement.setAttribute('transform', `translate(${-bounds.minX}, ${-bounds.minY})`);
        }

        const svgData = new XMLSerializer().serializeToString(svgCopy);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.svg`;
        link.click();
        URL.revokeObjectURL(url);

        console.log('SVG导出成功:', filename, '尺寸:', width, 'x', height);
    } catch (error) {
        console.error('SVG导出失败:', error);
        eventBus.emit(Events.ERROR, { type: 'export', format: 'svg', error });
        throw error;
    }
}

export default exportAsSVG;

/**
 * 树布局算法
 * 计算节点的层级位置
 */

import { config } from '../core/config.js';
import { eventBus, Events } from '../core/eventBus.js';

/**
 * 计算树布局
 * @param {Object} root - 根节点
 * @param {Array} nodes - 所有节点
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 */
export function calculateTreeLayout(root, nodes, width, height) {
    eventBus.emit(Events.LAYOUT_START, { root, nodes });

    if (!root) {
        // 如果没有根节点，使用网格布局
        _applyGridLayout(nodes, width, height);
        eventBus.emit(Events.LAYOUT_END, { type: 'grid' });
        return;
    }

    // 计算节点大小
    _calculateNodeSizes(nodes);

    // 计算子树宽度
    _calculateSubtreeWidths(root);

    // 计算节点位置
    const startX = 100;
    const startY = 100;
    _calculateNodePositions(root, startX, startY);

    // 为孤立节点设置默认位置
    _handleIsolatedNodes(nodes, width, height);

    // 应用布局
    _applyLayout(nodes);

    eventBus.emit(Events.LAYOUT_END, { type: 'tree' });
}

/**
 * 处理孤立节点
 * @private
 */
function _handleIsolatedNodes(nodes, width, height) {
    let isolatedCount = 0;
    const isolatedNodes = nodes.filter(node => node.x === undefined || node.y === undefined);
    
    isolatedNodes.forEach(node => {
        // 设置默认子树宽度
        if (node.subtreeWidth === undefined) {
            node.subtreeWidth = node.width;
        }
        
        // 设置默认位置（放在右侧）
        node.x = width - 200 - (isolatedCount % 3) * 200;
        node.y = 100 + Math.floor(isolatedCount / 3) * 150;
        
        isolatedCount++;
    });
}

/**
 * 计算节点大小
 * @private
 */
function _calculateNodeSizes(nodes) {
    nodes.forEach(node => {
        const label = node.label || '';
        const textWidth = _calculateTextWidth(label);
        const extraWidth = node.shape === 'parallelogram' 
            ? config.node.extraWidth.parallelogram 
            : 0;
        const padding = config.node.padding.horizontal * 2;

        node.width = Math.max(
            config.node.minWidth,
            textWidth + padding + extraWidth
        );
        node.height = config.node.defaultHeight;
    });
}

/**
 * 计算文本宽度
 * @private
 */
function _calculateTextWidth(label) {
    let textWidth = 0;
    for (let i = 0; i < label.length; i++) {
        const charCode = label.charCodeAt(i);
        if (charCode > 127 || (charCode >= 0xFF00 && charCode <= 0xFFEF)) {
            // 中文字符或全角字符
            textWidth += config.text.charWidth.chinese;
        } else {
            // 英文字符或半角字符
            textWidth += config.text.charWidth.english;
        }
    }
    return textWidth;
}

/**
 * 计算子树宽度
 * @private
 */
function _calculateSubtreeWidths(node) {
    if (!node.children || node.children.length === 0) {
        node.subtreeWidth = node.width;
        return;
    }

    // 递归计算子节点宽度
    node.children.forEach(child => {
        _calculateSubtreeWidths(child);
    });

    // 子树宽度为所有子节点宽度之和
    const totalChildrenWidth = node.children.reduce(
        (sum, child) => sum + child.subtreeWidth,
        0
    );
    const spacing = (node.children.length - 1) * config.layout.siblingSpacing;

    node.subtreeWidth = Math.max(node.width, totalChildrenWidth + spacing);
}

/**
 * 计算节点位置
 * @private
 */
function _calculateNodePositions(node, startX, startY, level = 0) {
    node.x = startX + node.subtreeWidth / 2;
    node.y = startY + level * config.layout.levelHeight;

    if (!node.children || node.children.length === 0) {
        return;
    }

    // 计算子节点起始位置，使子节点围绕父节点中心对称分布
    const childrenTotalWidth = node.children.reduce(
        (sum, child) => sum + child.subtreeWidth,
        0
    );
    const spacing = (node.children.length - 1) * config.layout.siblingSpacing;
    let childrenStartX = node.x - (childrenTotalWidth + spacing) / 2;

    // 递归计算子节点位置
    node.children.forEach(child => {
        _calculateNodePositions(child, childrenStartX, startY, level + 1);
        childrenStartX += child.subtreeWidth + config.layout.siblingSpacing;
    });
}

/**
 * 应用网格布局
 * @private
 */
function _applyGridLayout(nodes, width, height) {
    const cols = 3;
    nodes.forEach((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        node.x = 100 + col * 300;
        node.y = 100 + row * 150;
        node.width = config.node.defaultWidth;
        node.height = config.node.defaultHeight;
    });
}

/**
 * 应用布局
 * @private
 */
function _applyLayout(nodes) {
    nodes.forEach(node => {
        if (!node.fx) {
            node.fx = node.x;
            node.fy = node.y;
        }
    });
}

/**
 * 重新计算布局
 * @param {Object} root - 根节点
 * @param {Array} nodes - 所有节点
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 */
export function recalculateLayout(root, nodes, width, height) {
    calculateTreeLayout(root, nodes, width, height);
}

export default calculateTreeLayout;
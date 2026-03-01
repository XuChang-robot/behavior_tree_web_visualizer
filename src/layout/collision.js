/**
 * 碰撞检测模块
 * 完全按照app.js的实现方式
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { state } from '../core/state.js';

const collisionDistance = 10; // 碰撞检测的距离阈值

/**
 * 检测节点碰撞并自动布局
 * @param {Object} movedNode - 被移动的节点
 */
export function detectCollisions(movedNode) {
    const graphData = state.get('graph');
    if (!graphData || !graphData.nodes) {
        console.log('碰撞检测: 没有图数据');
        return;
    }
    
    console.log('碰撞检测开始，移动节点:', movedNode.name, '位置:', movedNode.x, movedNode.y);
    
    const processedNodes = new Set(); // 记录已处理的节点
    
    // 递归检测碰撞
    function processCollisions(node) {
        if (processedNodes.has(node.id)) return; // 避免重复处理
        processedNodes.add(node.id);
        
        const nodeRect = {
            x: node.x - node.width / 2,
            y: node.y - node.height / 2,
            width: node.width,
            height: node.height
        };
        
        console.log('检测节点:', node.name, '位置:', node.x, node.y, '矩形:', nodeRect);
        
        // 检测与其他节点的碰撞
        graphData.nodes.forEach(otherNode => {
            if (otherNode.id === node.id || processedNodes.has(otherNode.id)) return;
            
            const otherRect = {
                x: otherNode.x - otherNode.width / 2,
                y: otherNode.y - otherNode.height / 2,
                width: otherNode.width,
                height: otherNode.height
            };
            
            // 检测碰撞
            if (isColliding(nodeRect, otherRect, collisionDistance)) {
                console.log('发现碰撞:', node.name, '与', otherNode.name);
                // 计算新位置
                const newPosition = findNewPosition(otherNode, node);
                otherNode.x = newPosition.x;
                otherNode.y = newPosition.y;
                
                console.log('移动节点:', otherNode.name, '到新位置:', newPosition.x, newPosition.y);
                
                // 更新节点在DOM中的位置（使用d3选择器，与app.js一致）
                const selectedNodes = d3.selectAll('.node')
                    .filter(d => d.id === otherNode.id);
                
                console.log('选择的节点数量:', selectedNodes.size());
                
                selectedNodes
                    .attr('transform', `translate(${otherNode.x},${otherNode.y})`);
                
                // 递归处理被移动的节点，检查它是否与其他节点碰撞
                processCollisions(otherNode);
            }
        });
        
        // 如果该节点有子节点，递归检测子节点
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                processCollisions(child);
            });
        }
    }
    
    // 开始处理
    processCollisions(movedNode);
    console.log('碰撞检测完成');
}

/**
 * 检测两个矩形是否碰撞
 * @param {Object} rect1 - 矩形1
 * @param {Object} rect2 - 矩形2
 * @param {number} distance - 距离阈值
 * @returns {boolean} 是否碰撞
 */
function isColliding(rect1, rect2, distance) {
    const isColliding = !(
        rect1.x > rect2.x + rect2.width + distance ||
        rect1.x + rect1.width + distance < rect2.x ||
        rect1.y > rect2.y + rect2.height + distance ||
        rect1.y + rect1.height + distance < rect2.y
    );
    
    if (isColliding) {
        console.log('矩形碰撞检测: true', rect1, rect2);
    }
    
    return isColliding;
}

/**
 * 检测线段与矩形是否碰撞
 * @param {number} x1 - 线段起点x
 * @param {number} y1 - 线段起点y
 * @param {number} x2 - 线段终点x
 * @param {number} y2 - 线段终点y
 * @param {Object} rect - 矩形
 * @returns {boolean} 是否碰撞
 */
export function lineRectCollision(x1, y1, x2, y2, rect) {
    // 检查线段是否与矩形的四条边相交
    return (
        lineLineCollision(x1, y1, x2, y2, rect.x, rect.y, rect.x + rect.width, rect.y) ||
        lineLineCollision(x1, y1, x2, y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height) ||
        lineLineCollision(x1, y1, x2, y2, rect.x + rect.width, rect.y + rect.height, rect.x, rect.y + rect.height) ||
        lineLineCollision(x1, y1, x2, y2, rect.x, rect.y + rect.height, rect.x, rect.y) ||
        // 检查线段是否完全在矩形内部
        (x1 >= rect.x && x1 <= rect.x + rect.width && y1 >= rect.y && y1 <= rect.y + rect.height) ||
        (x2 >= rect.x && x2 <= rect.x + rect.width && y2 >= rect.y && y2 <= rect.y + rect.height)
    );
}

/**
 * 检测两条线段是否相交
 * @param {number} x1 - 线段1起点x
 * @param {number} y1 - 线段1起点y
 * @param {number} x2 - 线段1终点x
 * @param {number} y2 - 线段1终点y
 * @param {number} x3 - 线段2起点x
 * @param {number} y3 - 线段2起点y
 * @param {number} x4 - 线段2终点x
 * @param {number} y4 - 线段2终点y
 * @returns {boolean} 是否相交
 */
export function lineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom === 0) return false;
    
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    
    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

/**
 * 为碰撞的节点找到新位置
 * @param {Object} node - 需要移动的节点
 * @param {Object} movedNode - 移动导致碰撞的节点
 * @returns {Object} 新位置 {x, y}
 */
function findNewPosition(node, movedNode) {
    // 计算移动节点的边界
    const movedLeft = movedNode.x - movedNode.width / 2;
    const movedRight = movedNode.x + movedNode.width / 2;
    const movedTop = movedNode.y - movedNode.height / 2;
    const movedBottom = movedNode.y + movedNode.height / 2;
    
    // 计算当前节点的边界
    const nodeLeft = node.x - node.width / 2;
    const nodeRight = node.x + node.width / 2;
    const nodeTop = node.y - node.height / 2;
    const nodeBottom = node.y + node.height / 2;
    
    // 计算方向向量
    const dx = node.x - movedNode.x;
    const dy = node.y - movedNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 计算重叠距离
    let overlapX = 0;
    let overlapY = 0;
    
    if (dx > 0) {
        // 节点在移动节点的右侧
        overlapX = (movedRight + 10) - nodeLeft; // 10px 间隙
    } else if (dx < 0) {
        // 节点在移动节点的左侧
        overlapX = nodeRight - (movedLeft - 10);
    }
    
    if (dy > 0) {
        // 节点在移动节点的下方
        overlapY = (movedBottom + 10) - nodeTop;
    } else if (dy < 0) {
        // 节点在移动节点的上方
        overlapY = nodeBottom - (movedTop - 10);
    }
    
    // 计算需要移动的距离
    let moveDistance = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
        // 主要在水平方向碰撞
        moveDistance = Math.abs(overlapX) + 10;
    } else {
        // 主要在垂直方向碰撞
        moveDistance = Math.abs(overlapY) + 10;
    }
    
    // 确保最小移动距离
    moveDistance = Math.max(moveDistance, 20);
    
    let newX, newY;
    
    if (distance === 0) {
        // 如果两个节点中心重合，随机选择一个方向
        const angle = Math.random() * Math.PI * 2;
        newX = node.x + Math.cos(angle) * moveDistance;
        newY = node.y + Math.sin(angle) * moveDistance;
    } else {
        // 沿远离移动节点的方向移动
        newX = node.x + (dx / distance) * moveDistance;
        newY = node.y + (dy / distance) * moveDistance;
    }
    
    return { x: newX, y: newY };
}

/**
 * 自动布局
 * @param {Array} nodes - 所有节点
 */
export function autoLayout(nodes) {
    // 在app.js中，autoLayout是通过detectCollisions实现的
    // 这里提供一个空的实现，因为碰撞检测已经在dragended中处理
}

export default {
    detectCollisions,
    lineRectCollision,
    lineLineCollision,
    autoLayout
};

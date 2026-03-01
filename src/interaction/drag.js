/**
 * 拖拽交互模块
 * 完全按照app.js的实现方式
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { state } from '../core/state.js';
import { detectCollisions } from '../layout/collision.js';
import { updateLinks } from '../renderer/svgRenderer.js';

/**
 * 设置拖拽功能
 * @param {Function} onDragEnd - 拖拽结束回调
 * @param {Function} onDrag - 拖拽中回调
 * @returns {Object} d3.drag对象
 */
export function setupDrag(onDragEnd, onDrag) {
    return d3.drag()
        .on('start', dragstarted)
        .on('drag', function(event, d) {
            dragged.call(this, event, d);
            // 更新连接线
            _updateLinks();
            if (onDrag) onDrag();
        })
        .on('end', function(event, d) {
            dragended(event, d);
            // 更新连接线
            _updateLinks();
            if (onDragEnd) onDragEnd();
        });
}

/**
 * 更新连接线
 * @private
 */
function _updateLinks() {
    const linkGroup = state.get('render.linkGroup');
    const graphData = state.get('graph');
    if (linkGroup && graphData && graphData.links && graphData.nodes) {
        updateLinks(linkGroup, graphData.links, graphData.nodes);
    }
}

/**
 * 拖拽开始
 * @private
 */
function dragstarted(event, d) {
    if (d) {
        d.fx = d.x;
        d.fy = d.y;
    }
}

/**
 * 拖拽中
 * @private
 */
function dragged(event, d) {
    if (!d) return;
    
    const moveChildrenWithParent = document.getElementById('move-children-with-parent').checked;
    
    if (moveChildrenWithParent) {
        // 计算位移量
        const dx = event.x - d.x;
        const dy = event.y - d.y;
        
        // 移动当前节点
        d.fx = event.x;
        d.fy = event.y;
        d.x = event.x;
        d.y = event.y;
        
        // 更新节点DOM位置（使用d3选择器，与app.js一致）
        d3.select(this).attr('transform', `translate(${event.x},${event.y})`);
        
        // 递归移动所有子节点
        function moveChildren(node, dx, dy) {
            const graphData = state.get('graph');
            if (!graphData || !graphData.nodes) return;
            
            // 使用id查找节点对象
            const nodeObj = graphData.nodes.find(n => n.id === node.id);
            if (!nodeObj) return;
            
            // 移动子节点
            nodeObj.x += dx;
            nodeObj.y += dy;
            
            // 更新子节点的DOM位置（使用d3选择器，与app.js一致）
            const childElement = d3.selectAll('.node')
                .filter(n => n.id === node.id);
            childElement.attr('transform', `translate(${nodeObj.x},${nodeObj.y})`);
            
            // 递归移动子节点的子节点
            if (node.children && node.children.length > 0) {
                node.children.forEach(child => {
                    moveChildren(child, dx, dy);
                });
            }
        }
        
        // 移动所有子节点
        if (d.children && d.children.length > 0) {
            d.children.forEach(child => {
                moveChildren(child, dx, dy);
            });
        }
    } else {
        // 不移动子节点，只移动当前节点
        d.fx = event.x;
        d.fy = event.y;
        // 更新节点位置（使用d3选择器，与app.js一致）
        d3.select(this).attr('transform', `translate(${event.x},${event.y})`);
        // 实时更新连接线
        d.x = event.x;
        d.y = event.y;
    }
}

/**
 * 拖拽结束
 * @private
 */
function dragended(event, d) {
    if (d) {
        d.x = d.fx;
        d.y = d.fy;
        d.fx = null;
        d.fy = null;
        
        // 更新连接线（与app.js一致）
        _updateLinks();
        
        // 碰撞检测和自动布局（无论选项是否启用，都进行碰撞检测）
        detectCollisions(d);
    }
}

export default setupDrag;

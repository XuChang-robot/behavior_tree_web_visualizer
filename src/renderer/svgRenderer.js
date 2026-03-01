/**
 * SVG渲染器
 * 负责渲染行为树到SVG
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { config } from '../core/config.js';
import { eventBus, Events } from '../core/eventBus.js';
import { state } from '../core/state.js';
import { createShape } from './shapes/index.js';
import { setupDrag } from '../interaction/drag.js';

/**
 * 创建SVG画布
 * @param {HTMLElement} container - 容器元素
 * @returns {Object} { svg, g, linkGroup, nodeGroup, zoom }
 */
export function createSVG(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    const linkGroup = g.append('g')
        .attr('class', 'links');

    const nodeGroup = g.append('g')
        .attr('class', 'nodes');

    const zoom = d3.zoom()
        .scaleExtent([config.zoom.minScale, config.zoom.maxScale])
        .on('start', (event) => {
            console.log('Zoom start - scale:', event.transform.k);
        })
        .on('zoom', (event) => {
            console.log('Zoom - scale:', event.transform.k);
            g.attr('transform', event.transform);
            state.setViewTransform(event.transform.k, event.transform.x, event.transform.y);
        });

    svg.call(zoom);

    // 重置zoom状态，确保没有初始缩放
    svg.call(zoom.transform, d3.zoomIdentity);

    state.set('render.svg', svg);
    state.set('render.g', g);
    state.set('render.linkGroup', linkGroup);
    state.set('render.nodeGroup', nodeGroup);
    state.set('render.zoom', zoom);

    return { svg, g, linkGroup, nodeGroup, zoom };
}

/**
 * 渲染节点
 * @param {Object} linkGroup - 连接线组
 * @param {Object} nodeGroup - 节点组
 * @param {Array} nodes - 节点数据
 * @param {Function} onDragEnd - 拖拽结束回调
 * @param {Function} onDrag - 拖拽中回调
 */
export function renderNodes(linkGroup, nodeGroup, nodes, onDragEnd, onDrag) {
    const nodeElements = nodeGroup.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('data-id', d => d.id)
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .call(setupDrag(onDragEnd, onDrag));

    renderShapes(nodeElements);
    renderAnchors(nodeElements, nodes);
    renderLabels(nodeElements);

    return nodeElements;
}

/**
 * 渲染形状
 * @private
 */
function renderShapes(nodeElements) {
    nodeElements.each(function(d) {
        const element = d3.select(this);
        createShape(element, d);
    });
}

/**
 * 渲染锚点
 * @private
 */
function renderAnchors(nodeElements, nodes) {
    nodeElements.each(function(d) {
        const element = d3.select(this);
        const isRoot = !state.get('graph.links').some(link => link.target === d.id);
        const isLeaf = !state.get('graph.links').some(link => link.source === d.id);

        // 只有非根节点才添加顶部锚点
        if (!isRoot) {
            element.append('circle')
                .attr('class', 'anchor top-anchor')
                .attr('r', config.node.anchorRadius)
                .attr('cx', 0)
                .attr('cy', -d.height / 2)
                .attr('fill', config.node.anchorColors.top)
                .attr('stroke', config.colors.stroke)
                .attr('stroke-width', 1);
        }

        // 只有非叶节点才添加底部锚点
        if (!isLeaf) {
            element.append('circle')
                .attr('class', 'anchor bottom-anchor')
                .attr('r', config.node.anchorRadius)
                .attr('cx', 0)
                .attr('cy', d.height / 2)
                .attr('fill', config.node.anchorColors.bottom)
                .attr('stroke', config.colors.stroke)
                .attr('stroke-width', 1);
        }
    });
}

/**
 * 渲染标签
 * @private
 */
function renderLabels(nodeElements) {
    nodeElements.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('fill', config.colors.text)
        .text(d => d.label || '');
}

/**
 * 渲染连接线
 * 完全按照app.js的实现方式
 * @param {Object} linkGroup - 连接线组
 * @param {Array} links - 连接数据
 * @param {Array} nodes - 节点数据
 */
export function renderLinks(linkGroup, links, nodes) {
    // 延迟创建连接线，确保节点位置已经计算完成
    setTimeout(() => {
        updateLinks(linkGroup, links, nodes);
    }, 100);
}

/**
 * 更新连接线
 * 完全按照app.js的实现方式
 * @param {Object} linkGroup - 连接线组
 * @param {Array} links - 连接数据
 * @param {Array} nodes - 节点数据
 */
export function updateLinks(linkGroup, links, nodes) {
    if (!linkGroup || !links || !nodes) return;
    
    // 清除旧连接
    linkGroup.selectAll('path').remove();
    
    // 创建新连接
    const linkElements = linkGroup.selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => {
            const targetNode = nodes.find(n => n.id === d.target);
            return targetNode ? targetNode.color : '#666';
        })
        .attr('stroke-opacity', 0.8)
        .attr('stroke-width', 3);
    
    // 更新连接路径
    linkElements.attr('d', (d, i) => {
        const sourceNode = nodes.find(n => n.id === d.source);
        const targetNode = nodes.find(n => n.id === d.target);
        
        if (!sourceNode || !targetNode) return '';
        
        // 计算锚点位置
        // 源节点底部锚点（从锚点出发）
        const sourceX = sourceNode.x;
        const sourceY = sourceNode.y + sourceNode.height / 2;
        
        // 目标节点顶部锚点（从锚点出发）
        const targetX = targetNode.x;
        const targetY = targetNode.y - targetNode.height / 2;
        
        // 计算距离和方向
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        
        // 创建贝塞尔曲线
        // 源端控制点：垂直向下偏移（保持平滑）
        const controlPoint1X = sourceX;
        const controlPoint1Y = sourceY + Math.min(80, dy * 0.5);
        // 目标端控制点：添加轻微水平偏移，使箭头方向更自然
        const controlPoint2X = targetX - dx * 0.15;
        const controlPoint2Y = targetY - Math.min(80, dy * 0.5);
        
        return `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`;
    });
}

/**
 * 添加箭头标记
 * 完全按照app.js的实现方式
 * @param {Object} svg - SVG元素
 */
export function addArrowMarker(svg) {
    // 检查是否已存在箭头标记
    if (!svg.select('#arrowhead').node()) {
        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -2.5 5 5')
            .attr('refX', 3.5)
            .attr('refY', 0)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-2.5L5,0L0,2.5')
            .attr('fill', '#666');
    }
}

/**
 * 清除渲染内容
 * @param {Object} svg - SVG元素
 */
export function clear(svg) {
    svg.selectAll('*').remove();
}

/**
 * 计算树的边界
 * @param {Array} nodes - 节点数据
 * @returns {Object} { minX, minY, maxX, maxY }
 */
export function calculateTreeBounds(nodes) {
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
        if (node.x === undefined) node.x = 0;
        if (node.y === undefined) node.y = 0;
        if (node.width === undefined) node.width = 100;
        if (node.height === undefined) node.height = 50;
        
        const nodeLeft = node.x - node.width / 2 - 40;
        const nodeRight = node.x + node.width / 2 + 40;
        const nodeTop = node.y - node.height / 2 - 40;
        const nodeBottom = node.y + node.height / 2 + 40;

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
 * 自动缩放
 * @param {Object} svg - SVG元素
 * @param {Object} g -组元素
 * @param {Object} zoom - 缩放行为
 * @param {Array} nodes - 节点数据
 */
export function autoZoom(svg, g, zoom, nodes) {
    if (!nodes || nodes.length === 0) return;

    const bounds = calculateTreeBounds(nodes);
    const treeWidth = bounds.maxX - bounds.minX;
    const treeHeight = bounds.maxY - bounds.minY;

    const containerEl = document.getElementById('tree-container');
    
    // 确保容器已渲染，获取实际尺寸
    const containerWidth = containerEl.clientWidth || containerEl.offsetWidth || 800;
    const containerHeight = containerEl.clientHeight || containerEl.offsetHeight || 600;

    // 计算缩放比例，确保树完全显示
    const scaleX = (containerWidth - 80) / treeWidth;
    const scaleY = (containerHeight - 80) / treeHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    console.log('AutoZoom scale:', scale);
    console.log('Tree size:', treeWidth, 'x', treeHeight);
    console.log('Container size:', containerWidth, 'x', containerHeight);

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const translateX = containerWidth / 2 - centerX * scale;
    const translateY = containerHeight / 2 - centerY * scale;

    const transform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale);

    // 直接设置transform，不使用过渡动画
    g.attr('transform', transform);
    svg.call(zoom.transform, transform);
    
    // 保存初始缩放状态
    state.set('render.initialScale', scale);
    state.set('render.initialTransform', transform);
}

export default {
    createSVG,
    renderNodes,
    renderLinks,
    updateLinks,
    addArrowMarker,
    clear,
    calculateTreeBounds,
    autoZoom
};

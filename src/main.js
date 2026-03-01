/**
 * 主入口文件
 * 初始化应用并协调各模块
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { config } from './core/config.js';
import { state } from './core/state.js';
import { eventBus, Events } from './core/eventBus.js';
import { parseDotFile } from './parser/dotParser.js';
import { calculateTreeLayout, recalculateLayout } from './layout/treeLayout.js';
import { autoLayout } from './layout/collision.js';
import { createSVG, renderNodes, renderLinks, updateLinks, addArrowMarker, autoZoom } from './renderer/svgRenderer.js';
import { exportAsSVG } from './export/svgExport.js';
import { exportAsPNG } from './export/pngExport.js';

let nodeElements = null;
let linkElements = null;

/**
 * 初始化应用
 */
export function init() {
    console.log('初始化应用...');
    setupFileUpload();
    setupSaveButtons();
    setupKeyboardShortcuts();
}

/**
 * 设置键盘快捷键
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 检查是否按下了R键（不区分大小写）
        if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            resetView();
        }
    });
}

/**
 * 设置文件上传功能
 */
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const errorMessage = document.getElementById('error-message');

    // 拖拽功能
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }

    uploadArea.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            processFile(files[0]);
            // 清除fileInput的值，确保选择相同文件时也能触发change事件
            e.target.value = '';
        }
    }

    function processFile(file) {
        if (file.name.endsWith('.dot')) {
            errorMessage.textContent = '';
            const loading = document.getElementById('loading');
            loading.style.display = 'block';
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                try {
                    const graphData = parseDotFile(content);
                    visualizeTree(graphData);
                } catch (error) {
                    errorMessage.textContent = '解析文件失败: ' + error.message;
                } finally {
                    loading.style.display = 'none';
                }
            };
            reader.onerror = function() {
                errorMessage.textContent = '文件读取失败';
                loading.style.display = 'none';
            };
            reader.readAsText(file);
        } else {
            errorMessage.textContent = '请上传 .dot 文件';
        }
    }
}

/**
 * 设置保存按钮
 */
function setupSaveButtons() {
    // 重置视图按钮
    document.getElementById('reset-view').addEventListener('click', () => {
        resetView();
    });

    document.getElementById('save-svg').addEventListener('click', () => {
        exportAsSVG('behavior_tree');
    });

    document.getElementById('save-png').addEventListener('click', () => {
        exportAsPNG('behavior_tree');
    });

    // 子节点随父节点移动选项
    document.getElementById('move-children-with-parent').addEventListener('change', (e) => {
        state.set('interaction.moveChildrenWithParent', e.target.checked);
    });
}

/**
 * 重置视图
 */
function resetView() {
    const svg = state.get('render.svg');
    const g = state.get('render.g');
    const zoom = state.get('render.zoom');
    
    if (!svg || !g || !zoom) {
        console.warn('未找到SVG元素，无法重置视图');
        return;
    }

    // 获取保存的初始缩放状态
    const initialScale = state.get('render.initialScale');
    const initialTransform = state.get('render.initialTransform');
    
    // 如果有初始缩放状态，使用它
    if (initialScale && initialTransform) {
        g.attr('transform', initialTransform);
        svg.call(zoom.transform, initialTransform);
    } else {
        // 如果没有初始状态，重置为默认值
        zoom.transform(svg, d3.zoomIdentity);
    }
    
    console.log('视图已重置');
}

/**
 * 可视化行为树
 * @param {Object} graphData - 图数据 { nodes, links }
 */
function visualizeTree(graphData) {
    try {
        const container = document.getElementById('tree-container');
        
        // 确保容器尺寸正确
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;

        // 清除旧的缩放状态，确保新文件使用初始缩放
        state.set('render.initialScale', null);
        state.set('render.initialTransform', null);
        
        // 清除旧的渲染引用
        state.set('render.svg', null);
        state.set('render.g', null);
        state.set('render.nodeElements', null);
        state.set('render.linkGroup', null);
        state.set('render.zoom', null);
        
        // 清除window引用
        window.svg = null;
        window.nodeElements = null;
        window.linkGroup = null;
        window.zoom = null;

        // 清除之前的内容
        const svgElement = document.querySelector('svg');
        if (svgElement) {
            svgElement.remove();
        }

        // 检查数据
        if (!graphData || graphData.nodes.length === 0) {
            console.error('没有数据可可视化');
            return;
        }

        // 保存图数据到状态
        state.setGraphData(graphData);

        // 构建树结构用于布局
        const root = buildTreeStructure(graphData.nodes, graphData.links);

        // 先计算布局（此时节点还没有位置信息）
        calculateTreeLayout(root, graphData.nodes, width, height);

        // 创建SVG
        const { svg, g, linkGroup, nodeGroup, zoom } = createSVG(container);
        addArrowMarker(svg);

        // 渲染节点和连接线
        nodeElements = renderNodes(
            linkGroup, 
            nodeGroup, 
            graphData.nodes, 
            () => {
                updateLinks(linkGroup, graphData.links, graphData.nodes);
            },
            () => {
                updateLinks(linkGroup, graphData.links, graphData.nodes);
            }
        );
        linkElements = renderLinks(linkGroup, graphData.links, graphData.nodes);

        // 立即执行自动缩放
        autoZoom(svg, g, zoom, graphData.nodes);

        // 保存引用到state
        state.set('render.svg', svg);
        state.set('render.g', g);
        state.set('render.nodeElements', nodeElements);
        state.set('render.linkGroup', linkGroup);
        state.set('render.zoom', zoom);
        
        // 同时保存到window以便调试
        window.svg = svg;
        window.nodeElements = nodeElements;
        window.linkGroup = linkGroup;
        window.zoom = zoom;

        console.log('可视化完成');
    } catch (error) {
        console.error('可视化错误:', error);
        document.getElementById('error-message').textContent = '可视化错误: ' + error.message;
        eventBus.emit(Events.ERROR, { type: 'visualize', error });
    }
}

/**
 * 构建树结构
 * @param {Array} nodes - 节点数组
 * @param {Array} links - 连接数组
 * @returns {Object} 根节点
 */
function buildTreeStructure(nodes, links) {
    const nodeMap = new Map();

    // 为每个节点添加children属性
    nodes.forEach(node => {
        node.children = [];
        nodeMap.set(node.id, node);
    });

    // 构建父子关系
    links.forEach(link => {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (source && target && source.id !== target.id) { // 跳过自连接
            source.children.push(target);
        }
    });

    // 找到所有没有父节点的节点
    const rootNodes = [];
    for (const node of nodes) {
        const hasParent = links.some(link => link.target === node.id);
        if (!hasParent) {
            rootNodes.push(nodeMap.get(node.id));
        }
    }

    // 如果有多个根节点，创建一个虚拟根节点
    let rootNode = null;
    if (rootNodes.length > 1) {
        // 创建虚拟根节点
        rootNode = {
            id: -1,
            name: '虚拟根节点',
            label: '',
            shape: 'box',
            color: 'transparent',
            width: 100,
            height: 50,
            children: rootNodes
        };
        // 将虚拟根节点添加到节点映射中
        nodeMap.set(rootNode.id, rootNode);
    } else if (rootNodes.length === 1) {
        // 如果只有一个根节点，直接使用
        rootNode = rootNodes[0];
    } else if (nodes.length > 0) {
        // 如果没有根节点，返回第一个节点
        rootNode = nodeMap.get(nodes[0].id);
    }

    console.log('根节点:', rootNode);
    return rootNode;
}

// 当页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

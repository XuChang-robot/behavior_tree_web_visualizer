/**
 * .dot文件解析器
 * 解析py_trees生成的.dot格式文件
 */

import { eventBus, Events } from '../core/eventBus.js';
import { config } from '../core/config.js';

/**
 * 解析.dot文件内容
 * @param {string} content - .dot文件内容
 * @returns {Object} { nodes, links }
 */
export function parseDotFile(content) {
    try {
        const nodes = [];
        const links = [];
        const nodeMap = new Map();

        console.log('解析器被调用，内容长度:', content.length);

        // 处理跨行的属性值（将断开的行合并）
        let processedContent = content;
        let prevLength = 0;
        while (processedContent.length !== prevLength) {
            prevLength = processedContent.length;
            // 匹配以 [ 开头但没有以 ] 结尾的行，与下一行合并
            processedContent = processedContent.replace(/(\[[^\]]*)\n([^\[]*\])/g, '$1$2');
        }

        // 提取节点和连接
        const lines = processedContent.split('\n');
        console.log('总行数:', lines.length);
        let nodeId = 0;

        for (const line of lines) {
            const trimmedLine = line.trim();
            console.log('处理行:', trimmedLine);

            // 跳过空行、注释和graph定义
            if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('#') || trimmedLine.startsWith('digraph') || trimmedLine.startsWith('graph') || trimmedLine.startsWith('}') || trimmedLine.startsWith('graph [') || trimmedLine.startsWith('node [') || trimmedLine.startsWith('edge [') || trimmedLine === 'ordering=out;') {
                console.log('跳过行:', trimmedLine);
                continue;
            }

            // 处理节点定义
            if (trimmedLine.includes('[label=')) {
                console.log('处理节点定义:', trimmedLine);
                
                // 处理节点名（可能带引号或空格）
                let nodeName, rest;
                
                // 处理带引号的节点名
                if (trimmedLine.startsWith('"')) {
                    const quoteEnd = trimmedLine.indexOf('"', 1);
                    if (quoteEnd !== -1) {
                        nodeName = trimmedLine.substring(1, quoteEnd);
                        rest = trimmedLine.substring(quoteEnd + 1);
                    }
                } 
                // 处理不带引号的节点名（可能包含中文）
                else {
                    const bracketIndex = trimmedLine.indexOf('[');
                    if (bracketIndex !== -1) {
                        nodeName = trimmedLine.substring(0, bracketIndex).trim();
                        rest = trimmedLine.substring(bracketIndex);
                    }
                }

                if (nodeName && rest) {
                    // 提取标签（处理带引号的值，可能包含转义字符）
                    const labelMatch = rest.match(/label="([^"]*)"/);
                    const labelMatch2 = rest.match(/label=([^,\]]+)/);
                    let label = nodeName;
                    if (labelMatch) {
                        label = labelMatch[1].replace(/\\n/g, '\n'); // 处理换行符转义
                    } else if (labelMatch2) {
                        label = labelMatch2[1].replace(/"/g, '');
                    }
                    
                    // 提取其他属性
                    const shapeMatch = rest.match(/shape=(["']?)([^"',\]]+)\1/);
                    const styleMatch = rest.match(/style=(["']?)([^"',\]]+)\1/);
                    const colorMatch = rest.match(/fillcolor=(["']?)([^"',\]]+)\1/);
                    const colorMatch2 = rest.match(/color=(["']?)([^"',\]]+)\1/);
                    
                    // 处理颜色，优先使用fillcolor，然后是color
                    let nodeColor = 'gray';
                    if (colorMatch) {
                        nodeColor = colorMatch[2];
                    } else if (colorMatch2) {
                        nodeColor = colorMatch2[2];
                    }
                    
                    // 处理形状
                    let nodeShape = 'rectangle';
                    if (shapeMatch) {
                        nodeShape = shapeMatch[2];
                    }
                    
                    // 输出调试信息
                    console.log('Node:', nodeName, 'Shape:', nodeShape, 'Label:', label, 'Color:', nodeColor);
                    
                    const node = {
                        id: nodeId++,
                        name: nodeName,
                        label: label,
                        shape: nodeShape,
                        style: styleMatch ? styleMatch[2] : '',
                        color: nodeColor
                    };
                    
                    nodes.push(node);
                    nodeMap.set(nodeName, node.id);
                    console.log('添加节点:', node);
                }
            }
            
            // 处理连接
            else if (trimmedLine.includes('->')) {
                console.log('处理连接定义:', trimmedLine);
                
                // 处理带引号的节点名
                let sourceName, targetName;
                const arrowIndex = trimmedLine.indexOf('->');
                
                if (arrowIndex !== -1) {
                    const sourcePart = trimmedLine.substring(0, arrowIndex).trim();
                    const targetPart = trimmedLine.substring(arrowIndex + 2).trim().replace(';', '');
                    
                    // 处理带引号的源节点
                    if (sourcePart.startsWith('"')) {
                        const quoteEnd = sourcePart.indexOf('"', 1);
                        if (quoteEnd !== -1) {
                            sourceName = sourcePart.substring(1, quoteEnd);
                        }
                    } else {
                        sourceName = sourcePart;
                    }
                    
                    // 处理带引号的目标节点
                    if (targetPart.startsWith('"')) {
                        const quoteEnd = targetPart.indexOf('"', 1);
                        if (quoteEnd !== -1) {
                            targetName = targetPart.substring(1, quoteEnd);
                        }
                    } else {
                        targetName = targetPart;
                    }
                    
                    // 确保节点存在
                    if (sourceName && !nodeMap.has(sourceName)) {
                        const node = {
                            id: nodeId++,
                            name: sourceName,
                            label: sourceName,
                            shape: 'ellipse',
                            style: '',
                            color: 'gray'
                        };
                        nodes.push(node);
                        nodeMap.set(sourceName, node.id);
                    }
                    
                    if (targetName && !nodeMap.has(targetName)) {
                        const node = {
                            id: nodeId++,
                            name: targetName,
                            label: targetName,
                            shape: 'ellipse',
                            style: '',
                            color: 'gray'
                        };
                        nodes.push(node);
                        nodeMap.set(targetName, node.id);
                    }
                    
                    if (sourceName && targetName) {
                        links.push({
                            source: nodeMap.get(sourceName),
                            target: nodeMap.get(targetName)
                        });
                        console.log('添加连接:', { source: nodeMap.get(sourceName), target: nodeMap.get(targetName) });
                    }
                }
            }
        }

        const result = { nodes, links };
        eventBus.emit(Events.GRAPH_LOADED, result);
        console.log('解析结果:', result);
        return result;
    } catch (error) {
        console.error('解析错误:', error);
        eventBus.emit(Events.ERROR, { type: 'parse', error });
        throw error;
    }
}

export default parseDotFile;

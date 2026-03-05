/**
 * 形状索引
 * 统一管理所有形状
 */

import * as Rectangle from './rectangle.js';
import * as Ellipse from './ellipse.js';
import * as Diamond from './diamond.js';
import * as Parallelogram from './parallelogram.js';
import * as Octagon from './octagon.js';

/**
 * 形状映射表
 */
const shapeMap = {
    rectangle: {
        create: Rectangle.createRectangle,
        is: Rectangle.isRectangle
    },
    box: {
        create: Rectangle.createRectangle,
        is: Rectangle.isRectangle
    },
    ellipse: {
        create: Ellipse.createEllipse,
        is: Ellipse.isEllipse
    },
    circle: {
        create: Ellipse.createEllipse,
        is: Ellipse.isEllipse
    },
    diamond: {
        create: Diamond.createDiamond,
        is: Diamond.isDiamond
    },
    parallelogram: {
        create: Parallelogram.createParallelogram,
        is: Parallelogram.isParallelogram
    },
    octagon: {
        create: Octagon.createOctagon,
        is: Octagon.isOctagon
    }
};

/**
 * 创建形状
 * @param {Object} selection - D3选择集
 * @param {Object} node - 节点数据
 */
export function createShape(selection, node) {
    const shapeType = node.shape || 'rectangle';
    const shape = shapeMap[shapeType];

    if (shape) {
        shape.create(selection, node);
    } else {
        // 默认使用矩形
        Rectangle.createRectangle(selection, node);
    }
}

/**
 * 检查形状类型
 * @param {string} shape - 形状名称
 * @returns {boolean} 是否支持
 */
export function isSupportedShape(shape) {
    return shape in shapeMap;
}

/**
 * 获取所有支持的形状
 * @returns {Array} 形状名称数组
 */
export function getSupportedShapes() {
    return Object.keys(shapeMap);
}

export default {
    createShape,
    isSupportedShape,
    getSupportedShapes
};

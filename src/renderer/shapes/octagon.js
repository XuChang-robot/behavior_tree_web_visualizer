/**
 * 八边形形状
 */
import { config } from '../../core/config.js';

export function createOctagon(selection, node) {
    const w = node.width;
    const h = node.height;
    const cut = Math.min(w, h) * 0.25; // 切角大小

    // 计算八边形的8个顶点
    const points = [
        `${-w/2 + cut},${-h/2}`,      // 上边左
        `${w/2 - cut},${-h/2}`,       // 上边右
        `${w/2},${-h/2 + cut}`,       // 右上
        `${w/2},${h/2 - cut}`,        // 右下
        `${w/2 - cut},${h/2}`,        // 下边右
        `${-w/2 + cut},${h/2}`,       // 下边左
        `${-w/2},${h/2 - cut}`,       // 左下
        `${-w/2},${-h/2 + cut}`       // 左上
    ].join(' ');

    selection.append('polygon')
        .attr('points', points)
        .attr('fill', node.color)
        .attr('stroke', config.colors.stroke)
        .attr('stroke-width', 1);
}

export function isOctagon(shape) {
    return shape === 'octagon';
}

/**
 * 平行四边形形状
 */
import { config } from '../../core/config.js';

export function createParallelogram(selection, node) {
    const skew = 30; // 倾斜角度
    const points = [
        -node.width / 2 + skew, -node.height / 2,
        node.width / 2 + skew, -node.height / 2,
        node.width / 2 - skew, node.height / 2,
        -node.width / 2 - skew, node.height / 2
    ];

    selection.append('polygon')
        .attr('points', points.join(','))
        .attr('fill', node.color)
        .attr('stroke', config.colors.stroke)
        .attr('stroke-width', 1);
}

export function isParallelogram(shape) {
    return shape === 'parallelogram';
}

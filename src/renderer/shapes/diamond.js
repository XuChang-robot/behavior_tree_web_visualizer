/**
 * 菱形形状
 */
import { config } from '../../core/config.js';

export function createDiamond(selection, node) {
    const points = [
        0, -node.height / 2,
        node.width / 2, 0,
        0, node.height / 2,
        -node.width / 2, 0
    ];

    selection.append('polygon')
        .attr('points', points.join(','))
        .attr('fill', node.color)
        .attr('stroke', config.colors.stroke)
        .attr('stroke-width', 1);
}

export function isDiamond(shape) {
    return shape === 'diamond';
}

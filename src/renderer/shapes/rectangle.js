/**
 * 矩形形状
 */
import { config } from '../../core/config.js';

export function createRectangle(selection, node) {
    selection.append('rect')
        .attr('width', node.width)
        .attr('height', node.height)
        .attr('x', -node.width / 2)
        .attr('y', -node.height / 2)
        .attr('rx', config.node.cornerRadius)
        .attr('ry', config.node.cornerRadius)
        .attr('fill', node.color)
        .attr('stroke', config.colors.stroke)
        .attr('stroke-width', 1);
}

export function isRectangle(shape) {
    return shape === 'rectangle' || shape === 'box';
}

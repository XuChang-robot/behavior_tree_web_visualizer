/**
 * 椭圆形状
 */
import { config } from '../../core/config.js';

export function createEllipse(selection, node) {
    selection.append('ellipse')
        .attr('rx', node.width / 2)
        .attr('ry', node.height / 2)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', node.color)
        .attr('stroke', config.colors.stroke)
        .attr('stroke-width', 1);
}

export function isEllipse(shape) {
    return shape === 'ellipse' || shape === 'circle';
}

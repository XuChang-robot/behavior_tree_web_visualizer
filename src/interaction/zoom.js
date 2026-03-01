/**
 * 缩放交互模块
 * 处理缩放功能
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { config } from '../core/config.js';
import { eventBus, Events } from '../core/eventBus.js';
import { state } from '../core/state.js';

/**
 * 设置缩放功能
 * @param {Object} svg - SVG元素
 * @param {Object} g - 组元素
 * @returns {Object} zoom行为
 */
export function setupZoom(svg, g) {
    const zoom = d3.zoom()
        .scaleExtent([config.zoom.minScale, config.zoom.maxScale])
        .on('start', (event) => {
            eventBus.emit(Events.VIEW_ZOOM, { type: 'start', scale: event.transform.k });
        })
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
            state.setViewTransform(event.transform.k, event.transform.x, event.transform.y);
            eventBus.emit(Events.VIEW_ZOOM, { type: 'zoom', scale: event.transform.k });
        });

    svg.call(zoom);
    return zoom;
}

/**
 * 应用缩放变换
 * @param {Object} g - 组元素
 * @param {number} scale - 缩放比例
 * @param {number} x - X偏移
 * @param {number} y - Y偏移
 */
export function applyTransform(g, scale, x, y) {
    const transform = d3.zoomIdentity
        .translate(x, y)
        .scale(scale);

    g.attr('transform', transform);
}

/**
 * 重置缩放
 * @param {Object} svg - SVG元素
 * @param {Object} zoom - 缩放行为
 */
export function resetZoom(svg, zoom) {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
}

export default {
    setupZoom,
    applyTransform,
    resetZoom
};

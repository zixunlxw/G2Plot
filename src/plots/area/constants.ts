import { Plot } from '../../core/plot';
import { deepAssign } from '../../utils';

/** point 标注点视图 */
export const POINT_VIEW_ID = 'point-view';

/**
 * 面积图默认配置项
 */
export const DEFAULT_OPTIONS = deepAssign({}, Plot.getDefaultOptions(), {
  tooltip: {
    shared: true,
    showMarkers: true,
    showCrosshairs: true,
    crosshairs: {
      type: 'x',
    },
  },
  isStack: true,
  // 默认开启
  line: {},
  legend: {
    position: 'top-left',
  },
});

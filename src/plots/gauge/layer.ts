/**
 * @author linhuiw
 * @description 仪表盘 layer
 */
import { deepMix, uniqueId } from '@antv/util';
import { registerPlotType } from '../../base/global';
import { LayerConfig } from '../../base/layer';
import ViewLayer from '../../base/view-layer';
import { ElementOption } from '../../interface/config';
import { extractScale } from '../../util/scale';
import './theme';
import { GaugeViewConfig } from './options';
import { GaugeShape } from './geometry/shape/gauge-shape';
import { getOptions } from './geometry/shape/options';
import { getGlobalTheme } from '../../theme';
import * as EventParser from './event';

export interface GaugeLayerConfig extends GaugeViewConfig, LayerConfig {}

export default class GaugeLayer<T extends GaugeLayerConfig = GaugeLayerConfig> extends ViewLayer<T> {
  data: [];

  gaugeShape: any;

  options: any;

  constructor(props) {
    super(props);
  }

  public static getDefaultOptions(): any {
    return deepMix({}, super.getDefaultOptions(), {
      startAngle: -7 / 6,
      endAngle: 1 / 6,
      rangeBackgroundStyle:{
        fill:'#f0f0f0'
      },
      rangeSize: 24,
      statistic: {
        position: ['50%', '80%'],
      },
      axis:{
        visible: true,
        offset: -35,
        tickCount: 21,
        subTickCount: 4,
        tickLine:{
          visible: true,
          length: 5,
          style:{
            stroke:'#aaa',
            lineWidth: 2
          }
        },
        label:{
          visible: true,
          style:{
            fill:'#aaa',
            fontSize: 16,
            textAlign:'center',
            textBaseline:'middle'
          }
        }
      },
      pivot:{
        visible: true,
        tickness: 6,
        pin:{
          visible: true,
          size: 2,
          style:{
            fill:'#2E364B'
          },
        },
        base:{
          visible: true,
          size: 5,
          style:{
            fill:'#EEEEEE'
          }
        },
        pointer:{
          visible: true,
          style:{
            fill:'#CFCFCF'
          }
        }
      }
    });
  }

  public type: string = 'gauge';

  public init() {
    const { value, range } = this.options;
    const rangeSorted = (range || []).map((d: number) => +d).sort((a: number, b: number) => a - b);

    const { min = rangeSorted[0], max = rangeSorted[rangeSorted.length - 1], format = (d) => `${d}` } = this.options;

    const valueText = format(value);
    const styleMix = this.getStyleMix();
    this.options.styleMix = styleMix;
    this.options.data = [{ value: value || 0 }];
    this.options.valueText = valueText;
    this.options.min = min;
    this.options.max = max;
    this.options.format = format;
    this.initG2Shape();
    super.init();
  }

  protected getStyleMix() {
    const { gaugeStyle = {}, statistic = {} } = this.options;
    const { width, height } = this;
    const size = Math.max(width, height) / 20;
    const defaultStyle = Object.assign({}, this.theme, {
      stripWidth: size,
      tickLabelSize: size / 2,
    });
    if (!statistic.size) {
      statistic.size = size * 1.2;
    }
    const style = deepMix({}, defaultStyle, gaugeStyle, { statistic });
    return style;
  }

  /**
   * 绘制指针
   */
  protected initG2Shape() {
    this.gaugeShape = new GaugeShape(uniqueId());
    this.gaugeShape.setOption(
      this.type,
      deepMix({},this.options,{
        radius: 1,
        angle: 240,
        textPosition: '100%',
      }),
    );
    this.gaugeShape.render();
  }

  protected getCustomStyle() {
    const { color, theme } = this.options;
    const globalTheme = getGlobalTheme();
    const colors = color || globalTheme.colors;
    return getOptions('standard', theme, colors);
  }

  protected geometryParser(dim: string, type: string): string {
    throw new Error('Method not implemented.');
  }

  protected scale() {
    const { min, max, format, styleMix } = this.options;
    const scales = {
      value: {},
    };
    extractScale(scales.value, {
      min,
      max,
      minLimit: min,
      maxLimit: max,
      nice: true,
      formatter: format,
      // 自定义 tick step
      tickInterval: styleMix.tickInterval,
    });
    // @ts-ignore
    this.setConfig('scales', scales);
    super.scale();
  }

  protected coord() {
    const coordConfig: any = {
      type: 'polar',
      cfg: {
        radius: 1,
        startAngle: this.options.startAngle * Math.PI,
        endAngle: this.options.endAngle * Math.PI,
      },
    };
    this.setConfig('coordinate', coordConfig);
  }

  protected axis() {
    const { axis } = this.options;

    const axesConfig:any = {
      value :{
        line: null,
        grid: null,
        tickLine: null,
      }
    };

    if(axis.label.visible){
      axesConfig.value.label = {
        offset: axis.offset - axis.label.style.fontSize,
        textStyle: axis.label.style,
        autoRotate: true
      };
    }

    axesConfig['1'] = false;
    this.setConfig('axes', axesConfig);
  }

  protected addGeometry() {
    const { styleMix } = this.options;
    const pointerColor = styleMix.pointerColor || this.theme.defaultColor;

    const pointer: ElementOption = {
      type: 'point',
      position: {
        fields: ['value', '1'],
      },
      shape: {
        values: ['gauge'],
      },
      color: {
        values: [pointerColor],
      },
    };

    this.setConfig('geometry', pointer);
  }

  protected annotation() {
    const { statistic, style } = this.options;
    const annotationConfigs = [];
    // @ts-ignore
    if (statistic && statistic.visible) {
      const statistics = this.renderStatistic();
      annotationConfigs.push(statistics);
    }
    this.setConfig('annotations', annotationConfigs);
  }

  protected renderStatistic() {
    const { statistic, styleMix } = this.options;
    const text = {
      type: 'text',
      content: statistic.text,
      top: true,
      position: styleMix.statistic.position,
      style: {
        fill: styleMix.statistic.color,
        fontSize: styleMix.statistic.size,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    };
    return text;
  }

  protected parseEvents(eventParser) {
    super.parseEvents(EventParser);
  }
}

registerPlotType('gauge', GaugeLayer);

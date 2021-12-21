import { Rose } from '@antv/g2plot';

const data = [
  {
    type: 'members:50',
    value: 50,
    user: 'members',
  },
  {
    type: 'members:45',
    value: 45,
    user: 'members',
  },
  {
    type: 'members:65',
    value: 65,
    user: 'members',
  },
  {
    type: 'members:25',
    value: 25,
    user: 'members',
  },
  {
    type: 'members:33',
    value: 33,
    user: 'members',
  },
  {
    type: 'members:20',
    value: 20,
    user: 'members',
  },
  {
    type: 'members:50',
    value: 7,
    user: 'owners',
  },
  {
    type: 'members:45',
    value: 5,
    user: 'owners',
  },
  {
    type: 'members:65',
    value: 38,
    user: 'owners',
  },
  {
    type: 'members:25',
    value: 5,
    user: 'owners',
  },
  {
    type: 'members:33',
    value: 20,
    user: 'owners',
  },
  {
    type: 'members:20',
    value: 15,
    user: 'owners',
  },
];

// 堆叠玫瑰图
const rosePlot = new Rose('container', {
  data,
  xField: 'type',
  yField: 'value',
  isStack: true,
  // 当 isStack 为 true 时，该值为必填
  seriesField: 'user',
  radius: 0.9,
  label: {
    offset: -15,
  },
  interactions: [
    {
      type: 'element-active',
    },
  ],
});

rosePlot.render();

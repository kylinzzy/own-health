/**
 * 轻量级图表绘制工具
 * 基于Canvas API实现体重趋势曲线图
 * 支持手势缩放和滑动查看
 */

/**
 * 绘制体重趋势图
 * @param {Object} options - 配置选项
 * @param {string} options.canvasId - Canvas元素ID
 * @param {Array} options.data - 数据数组 [{date, value}]
 * @param {number} options.width - 画布宽度
 * @param {number} options.height - 画布高度
 * @param {string} options.lineColor - 线条颜色
 * @param {string} options.fillColor - 填充颜色
 * @param {boolean} options.showPoints - 是否显示数据点
 * @param {boolean} options.showArea - 是否显示面积填充
 */
function drawWeightChart(options) {
  const {
    canvasId,
    data,
    width = 375,
    height = 220,
    lineColor = '#2ECC71',
    fillColor = 'rgba(46, 204, 113, 0.1)',
    showPoints = true,
    showArea = true
  } = options;

  if (!data || data.length === 0) return;

  const ctx = wx.createCanvasContext(canvasId);
  const padding = { top: 20, right: 16, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 计算数值范围
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;
  const valuePadding = valueRange * 0.1;
  const yMin = minValue - valuePadding;
  const yMax = maxValue + valuePadding;

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 绘制网格线
  ctx.setStrokeStyle('#ECF0F1');
  ctx.setLineWidth(0.5);
  
  // Y轴网格线
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const y = padding.top + (chartHeight / ySteps) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    // Y轴标签
    const value = yMax - (yMax - yMin) * (i / ySteps);
    ctx.setFillStyle('#7F8C8D');
    ctx.setFontSize(10);
    ctx.setTextAlign('right');
    ctx.fillText(value.toFixed(1), padding.left - 6, y + 3);
  }

  // 计算坐标点
  const points = data.map((item, index) => {
    const x = padding.left + (chartWidth / (data.length - 1 || 1)) * index;
    const y = padding.top + chartHeight - ((item.value - yMin) / (yMax - yMin)) * chartHeight;
    return { x, y, value: item.value, date: item.date };
  });

  // 绘制面积填充
  if (showArea && points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartHeight);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.setFillStyle(fillColor);
    ctx.fill();
  }

  // 绘制线条
  if (points.length > 1) {
    ctx.beginPath();
    ctx.setStrokeStyle(lineColor);
    ctx.setLineWidth(2);
    ctx.setLineJoin('round');
    ctx.setLineCap('round');
    
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        // 使用贝塞尔曲线使线条更平滑
        const prev = points[index - 1];
        const cp1x = prev.x + (point.x - prev.x) / 3;
        const cp1y = prev.y;
        const cp2x = prev.x + (point.x - prev.x) * 2 / 3;
        const cp2y = point.y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
      }
    });
    ctx.stroke();
  }

  // 绘制数据点
  if (showPoints) {
    points.forEach((point, index) => {
      // 外圈
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.setFillStyle('#FFFFFF');
      ctx.fill();
      ctx.setStrokeStyle(lineColor);
      ctx.setLineWidth(2);
      ctx.stroke();

      // 内圈
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.setFillStyle(lineColor);
      ctx.fill();

      // 最高点和最低点标注
      if (point.value === maxValue) {
        ctx.setFillStyle('#E74C3C');
        ctx.setFontSize(10);
        ctx.setTextAlign('center');
        ctx.fillText('最高', point.x, point.y - 10);
      }
      if (point.value === minValue) {
        ctx.setFillStyle('#2ECC71');
        ctx.setFontSize(10);
        ctx.setTextAlign('center');
        ctx.fillText('最低', point.x, point.y + 18);
      }
    });
  }

  // X轴标签（显示部分日期避免重叠）
  const labelInterval = Math.ceil(data.length / 6);
  points.forEach((point, index) => {
    if (index % labelInterval === 0 || index === data.length - 1) {
      ctx.setFillStyle('#7F8C8D');
      ctx.setFontSize(9);
      ctx.setTextAlign('center');
      const dateStr = point.date.substring(5); // 显示 MM-DD
      ctx.fillText(dateStr, point.x, height - 16);
    }
  });

  // 绘制标题
  ctx.setFillStyle('#2C3E50');
  ctx.setFontSize(12);
  ctx.setTextAlign('left');
  ctx.fillText('体重趋势 (kg)', padding.left, 14);

  ctx.draw();
}

/**
 * 绘制营养占比饼图
 * @param {Object} options - 配置选项
 * @param {string} options.canvasId - Canvas元素ID
 * @param {Object} options.data - 数据 {protein, carbs, fat}
 * @param {number} options.width - 画布宽度
 * @param {number} options.height - 画布高度
 */
function drawNutritionPie(options) {
  const {
    canvasId,
    data,
    width = 120,
    height = 120
  } = options;

  const { protein = 0, carbs = 0, fat = 0 } = data;
  const total = protein + carbs + fat;

  if (total === 0) return;

  const ctx = wx.createCanvasContext(canvasId);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 8;

  const colors = ['#E74C3C', '#3498DB', '#F39C12'];
  const values = [protein, carbs, fat];
  const labels = ['蛋白质', '碳水', '脂肪'];

  let startAngle = -Math.PI / 2;

  values.forEach((value, index) => {
    const sliceAngle = (value / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    // 绘制扇形
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.setFillStyle(colors[index]);
    ctx.fill();

    // 绘制标签
    const labelAngle = startAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
    
    ctx.setFillStyle('#FFFFFF');
    ctx.setFontSize(10);
    ctx.setTextAlign('center');
    ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY + 3);

    startAngle = endAngle;
  });

  // 中心白色圆
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
  ctx.setFillStyle('#FFFFFF');
  ctx.fill();

  // 中心文字
  ctx.setFillStyle('#2C3E50');
  ctx.setFontSize(11);
  ctx.setTextAlign('center');
  ctx.fillText('营养', centerX, centerY - 2);
  ctx.setFontSize(9);
  ctx.setFillStyle('#7F8C8D');
  ctx.fillText('占比', centerX, centerY + 10);

  ctx.draw();
}

/**
 * 绘制热量对比柱状图
 * @param {Object} options - 配置选项
 * @param {string} options.canvasId - Canvas元素ID
 * @param {Array} options.data - 数据数组 [{label, intake, target}]
 * @param {number} options.width - 画布宽度
 * @param {number} options.height - 画布高度
 */
function drawCalorieBar(options) {
  const {
    canvasId,
    data,
    width = 375,
    height = 180
  } = options;

  if (!data || data.length === 0) return;

  const ctx = wx.createCanvasContext(canvasId);
  const padding = { top: 20, right: 16, bottom: 30, left: 16 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => Math.max(d.intake || 0, d.target || 0))) * 1.1;
  const barWidth = chartWidth / data.length * 0.6;
  const barSpacing = chartWidth / data.length;

  ctx.clearRect(0, 0, width, height);

  // 绘制网格线
  ctx.setStrokeStyle('#ECF0F1');
  ctx.setLineWidth(0.5);
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  data.forEach((item, index) => {
    const x = padding.left + barSpacing * index + (barSpacing - barWidth) / 2;
    
    // 目标值（背景条）
    if (item.target) {
      const targetHeight = (item.target / maxValue) * chartHeight;
      ctx.setFillStyle('#ECF0F1');
      ctx.fillRect(x, padding.top + chartHeight - targetHeight, barWidth, targetHeight);
    }

    // 实际摄入
    if (item.intake) {
      const intakeHeight = (item.intake / maxValue) * chartHeight;
      const color = item.intake > item.target ? '#E74C3C' : '#2ECC71';
      ctx.setFillStyle(color);
      ctx.fillRect(x, padding.top + chartHeight - intakeHeight, barWidth, intakeHeight);
    }

    // X轴标签
    ctx.setFillStyle('#7F8C8D');
    ctx.setFontSize(9);
    ctx.setTextAlign('center');
    ctx.fillText(item.label, x + barWidth / 2, height - 10);
  });

  ctx.draw();
}

module.exports = {
  drawWeightChart,
  drawNutritionPie,
  drawCalorieBar
};

export const prefix = 'oo'
export const colors = [
  'blue',
  'purple',
  'cyan',
  'green',
  'magenta',
  'pink',
  'red',
  'orange',
  'yellow',
  'volcano',
  'geekblue',
  'gold',
  'lime'
]

export const brandColors = [
  'colorPrimary',
  'colorPrimaryBg',
  'colorPrimaryBgHover',
  'colorPrimaryBorder',
  'colorPrimaryBorderHover',
  'colorPrimaryHover',
  'colorPrimaryActive',
  'colorPrimaryTextHover',
  'colorPrimaryText',
  'colorPrimaryTextActive'
]

export const successColors = [
  'colorSuccess',
  'colorSuccessBg',
  'colorSuccessBgHover',
  'colorSuccessBorder',
  'colorSuccessBorderHover',
  'colorSuccessHover',
  'colorSuccessActive',
  'colorSuccessTextHover',
  'colorSuccessText',
  'colorSuccessTextActive'
]

export const warningColors = [
  'colorWarning',
  'colorWarningBg',
  'colorWarningBgHover',
  'colorWarningBorder',
  'colorWarningBorderHover',
  'colorWarningHover',
  'colorWarningActive',
  'colorWarningTextHover',
  'colorWarningText',
  'colorWarningTextActive'
]

export const errorColors = [
  'colorError',
  'colorErrorBg',
  'colorErrorBgHover',
  'colorErrorBorder',
  'colorErrorBorderHover',
  'colorErrorHover',
  'colorErrorActive',
  'colorErrorTextHover',
  'colorErrorText',
  'colorErrorTextActive'
]

export const infoColors = [
  'colorInfo',
  'colorInfoBg',
  'colorInfoBgHover',
  'colorInfoBorder',
  'colorInfoBorderHover',
  'colorInfoHover',
  'colorInfoActive',
  'colorInfoTextHover',
  'colorInfoText',
  'colorInfoTextActive'
]

export const functionalColors = [...successColors, ...warningColors, ...errorColors, ...infoColors]

export const neutralColors = [
  'colorText',
  'colorTextSecondary',
  'colorTextTertiary',
  'colorTextQuaternary',
  'colorBgContainer',
  'colorBgElevated',
  'colorBgLayout',
  'colorBgSpotlight',
  'colorBgMask',
  'colorBorder',
  'colorBorderSecondary',
  'colorFill',
  'colorFillSecondary',
  'colorFillTertiary',
  'colorFillQuaternary'
]
export const productLevelColorSystem = [...brandColors, ...functionalColors]
export const colorPaletteNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
export const colorVariantsCount = 10

// ['blue', 'blue-1', 'blue-2', ……, 'blue-10', 'purple',……]
export const baseColorPalettes = colors.flatMap((color) => [
  color,
  ...Array.from({ length: colorVariantsCount }, (_, i) => `${color}-${i + 1}`)
])

/**
 * antd 的 token 中未提供关于 gray 系列的颜色
 *
 * 相关问题：
 * @see https://github.com/ant-design/ant-design/pull/31129
 * @see https://github.com/ant-design/ant-design/discussions/45411
 * @see https://github.com/ant-design/ant-design/issues/44247
 *
 *
 * 颜色来源：
 * @see https://ant.design/docs/spec/colors#neutral-color-palette
 */
export const neutralColorPalettes = [
  '#fafafa',
  '#f5f5f5',
  '#f0f0f0',
  '#d9d9d9',
  '#bfbfbf',
  '#8c8c8c',
  '#595959',
  '#434343',
  '#262626',
  '#1f1f1f',
  '#141414'
]

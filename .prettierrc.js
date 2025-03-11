/**
 * Prettier 配置文件
 *
 * 这个配置文件会覆盖 .prettierrc，并确保在所有环境中使用相同的格式化规则
 */
module.exports = {
  // 使用单引号而不是双引号
  singleQuote: true,
  // 在语句末尾使用分号
  semi: true,
  // 缩进使用2个空格
  tabWidth: 2,
  // 对象、数组等最后一项后面添加逗号
  trailingComma: 'es5',
  // 一行最大字符数
  printWidth: 100,
  // 在对象字面量的括号之间添加空格
  bracketSpacing: true,
  // 箭头函数参数周围不加括号 (x) => x 变成 x => x
  arrowParens: 'avoid',
  // 使用 lf 作为行结束符
  endOfLine: 'lf',
  // JSX 中使用双引号
  jsxSingleQuote: false,
  // JSX 标签的 > 放在最后一行的末尾，而不是单独放在下一行
  bracketSameLine: false,
  // 确保在服务器和本地使用相同的格式化规则
  overrides: [
    {
      files: '*.{js,jsx,ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
  ],
};

module.exports = {
  stories: [
    '../src/components/ui/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-controls'
  ],
  framework: {
    name: '@storybook/react',
    options: {}
  },
}; 
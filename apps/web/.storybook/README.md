# Storybook Setup for AlphaFrame Web

## Purpose
Storybook lets you view, test, and document UI components in isolation. This helps designers and developers make sure each component looks and works right before using it in the app.

## How to Use
1. Make sure you have installed all Storybook dependencies (see package.json devDependencies).
2. To start Storybook, run:
   ```bash
   npm run storybook
   ```
   This will open a local web page where you can see all UI components and their states.

## Adding New Stories
- To add a new component to Storybook, create a file ending in `.stories.jsx` in the same folder as your component (for example, `Button.stories.jsx`).
- Each story file should show different ways your component can be used (different props, styles, etc).

## Notes
- Storybook helps catch design and accessibility issues early.
- You can use Storybook's built-in tools to check for accessibility, test interactions, and see how your component looks with different data.

## Conclusion
Storybook is a powerful tool for building, testing, and sharing UI components. Use it to keep your design system strong and your app looking great! 
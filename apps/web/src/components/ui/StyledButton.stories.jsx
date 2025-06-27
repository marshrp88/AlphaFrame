import StyledButton from './StyledButton';

export default {
  title: 'UI/StyledButton',
  component: StyledButton,
};

export const Primary = () => <StyledButton>Primary Button</StyledButton>;
Primary.storyName = 'Primary';

export const Secondary = () => <StyledButton variant="secondary">Secondary Button</StyledButton>;
Secondary.storyName = 'Secondary';

export const Disabled = () => <StyledButton disabled>Disabled Button</StyledButton>;
Disabled.storyName = 'Disabled';

/**
 * Notes:
 * - This story shows different ways the StyledButton can look and act.
 * - "Primary" is the main button style. "Secondary" is for less important actions. "Disabled" means the button can't be clicked.
 * - Try changing the text or props to see how the button changes.
 */ 
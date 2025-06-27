import InputField from './InputField';

export default {
  title: 'UI/InputField',
  component: InputField,
};

export const Default = () => <InputField label="Name" />;
Default.storyName = 'Default';

export const WithPlaceholder = () => <InputField label="Email" placeholder="Enter your email" />;
WithPlaceholder.storyName = 'With Placeholder';

export const Disabled = () => <InputField label="Disabled" disabled />;
Disabled.storyName = 'Disabled';

/**
 * Notes:
 * - This story shows different ways to use the InputField.
 * - You can add a label, a placeholder, or make it disabled.
 * - InputFields let users type information into the app.
 */ 
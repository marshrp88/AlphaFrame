import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import OnboardingSteps from '../components/onboarding/OnboardingSteps';

export default function OnboardingFlow() {
  const { completeOnboarding, setDemo } = useAppStore();
  const navigate = useNavigate();

  const handleComplete = () => {
    setDemo(); // For demo mode
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-container" data-testid="onboarding-container">
      <OnboardingSteps onComplete={handleComplete} />
    </div>
  );
} 
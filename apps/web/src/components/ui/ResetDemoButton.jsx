import useAppStore from '../../store/useAppStore';

export default function ResetDemoButton() {
  const { isDemo, resetDemo } = useAppStore();
  if (!isDemo) return null;
  return (
    <button
      style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: '1px solid #6366f1', color: '#6366f1', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer' }}
      onClick={resetDemo}
      aria-label="Reset Demo Mode"
    >
      Reset Demo
    </button>
  );
} 
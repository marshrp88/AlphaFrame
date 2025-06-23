describe('FeedbackModule', () => {
  beforeEach(() => {
    // --- FINAL FIX: Only mock click and setAttribute, do NOT overwrite el.style ---
    const realCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = realCreateElement(tag);
      if (tag === 'a') {
        el.click = vi.fn();           // prevent actual navigation
        el.setAttribute = vi.fn();    // prevent attribute errors
        // Do NOT overwrite el.style!
      }
      return el;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders feedback module with correct title', () => {
    render(<FeedbackModule />);
    expect(screen.getByText('AlphaPro Feedback Export')).toBeInTheDocument();
  });

  it('renders generate button', () => {
    render(<FeedbackModule />);
    const generateButton = screen.getByText('Generate & Download Report');
    expect(generateButton).toBeInTheDocument();
  });

  it('handles report generation', async () => {
    // Arrange
    const mockLogs = [{ type: 'test.log', timestamp: '2024-01-01T00:00:00Z', payload: { test: 'data' } }];
    ExecutionLogService.queryLogs.mockResolvedValue(mockLogs);

    // --- Optional: Sanity check ---
    console.log('🧪 Link created:', document.createElement('a').constructor.name);  // Should be 'HTMLAnchorElement'

    render(<FeedbackModule />);
    
    // Act
    fireEvent.click(screen.getByText('Generate & Download Report'));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Feedback report generated and downloaded successfully!/i)).toBeInTheDocument();
    });

    // Verify the core logic was executed
    expect(ExecutionLogService.queryLogs).toHaveBeenCalled();
  });
}); 
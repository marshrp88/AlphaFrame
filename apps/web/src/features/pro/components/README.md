# AlphaPro FeedbackModule Component

## Purpose
The FeedbackModule component provides a comprehensive feedback system that allows users to generate and export execution logs and narrative insights in JSON format for debugging and support purposes.

## Features
- **Execution Log Export**: Collects and exports all system execution logs
- **Narrative Insights**: Includes placeholder for future narrative analysis integration
- **JSON Format**: Exports data in structured JSON format for easy analysis
- **Local Processing**: All data is processed locally with no external server calls
- **Privacy-First**: Maintains user data privacy with client-side processing
- **Error Handling**: Graceful error handling with user-friendly feedback

## Usage

### Basic Implementation
```jsx
import FeedbackModule from '@/features/pro/components/FeedbackModule.jsx';

function MyPage() {
  return (
    <div>
      <h1>Feedback</h1>
      <FeedbackModule />
    </div>
  );
}
```

### Integration with AlphaPro
The FeedbackModule is designed to integrate seamlessly with the AlphaPro dashboard and can be included in any page or modal.

## Component API

### Props
The FeedbackModule component accepts no props and is self-contained.

### State Management
The component manages its own state for:
- `isGenerating`: Loading state during report generation
- `error`: Error state for failed operations
- `success`: Success state after successful generation

### Events
- **Generate Report**: Triggers when the user clicks "Generate & Download Report"
- **Reset**: Resets the component state after success or error

## Data Structure

### Generated Report Format
```json
{
  "reportVersion": "1.0",
  "generatedAt": "2024-01-01T00:00:00.000Z",
  "source": "AlphaPro FeedbackModule",
  "data": {
    "executionLogs": [
      {
        "type": "user.action",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "payload": { "action": "test" }
      }
    ],
    "narrativeInsights": {
      "placeholder": "NarrativeService not yet implemented. This is a placeholder.",
      "generatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Dependencies

### Required Services
- `ExecutionLogService`: For collecting system execution logs
- `NarrativeService`: For future narrative insights (currently placeholder)

### UI Components
- `Button`: For action buttons
- `Card`: For layout and styling

## Testing

### Test Coverage
The component includes comprehensive tests covering:
- Component rendering and initial state
- Feedback report generation
- File download functionality
- Error handling
- UI state management
- Data privacy and security
- JSON export format validation

### Running Tests
```bash
cd apps/web
npm test -- FeedbackModule.test.jsx
```

## Security & Privacy

### Data Processing
- All data is processed locally in the browser
- No information is sent to external servers
- User data remains private and under user control

### Export Security
- Generated files are downloaded locally
- No cloud storage or external transmission
- JSON format allows for easy inspection and validation

## Future Enhancements

### Planned Features
1. **NarrativeService Integration**: Replace placeholder with actual narrative insights
2. **Additional Export Formats**: Support for CSV, XML, or other formats
3. **Customizable Data Selection**: Allow users to choose what data to include
4. **Encryption Options**: Optional encryption for sensitive data
5. **Cloud Integration**: Optional secure cloud backup (user-controlled)

### Integration Points
- Dashboard integration for easy access
- Modal support for overlay display
- API integration for automated reporting
- Webhook support for external system integration

## Troubleshooting

### Common Issues
1. **Download Not Working**: Check browser download settings and permissions
2. **Empty Reports**: Verify ExecutionLogService is properly initialized
3. **Large File Sizes**: Consider implementing data filtering options

### Error Messages
- "Could not generate the report. Please check the console for details.": Check browser console for specific error information
- "Generating...": Normal loading state, wait for completion

## Contributing

### Development Guidelines
1. Maintain privacy-first approach
2. Ensure all data processing remains local
3. Add comprehensive tests for new features
4. Update documentation for any API changes
5. Follow existing code style and patterns

### Code Structure
```
FeedbackModule.jsx          # Main component
FeedbackModule.test.jsx     # Comprehensive tests
README.md                   # This documentation
```

## Version History

### V1.0 (Current)
- Initial implementation
- Basic execution log export
- JSON format support
- Local processing only
- Comprehensive test coverage

### Future Versions
- Enhanced narrative insights
- Multiple export formats
- Advanced filtering options
- Cloud integration support 
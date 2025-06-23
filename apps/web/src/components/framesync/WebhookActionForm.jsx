/**
 * WebhookActionForm.jsx
 * Configuration form for webhook actions
 * Uses shadcn/ui form components
 */

import { jsxDEV } from "react/jsx-dev-runtime";
import { useState, useEffect } from 'react';
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/ui/use-toast";

/**
 * WebhookActionForm Component
 * 
 * A form component for configuring webhook actions in FrameSync.
 * Provides inputs for webhook URL and JSON payload with validation.
 * 
 * Props:
 * @param {Object} initialPayload - Initial configuration for the webhook
 * @param {Function} onChange - Callback when configuration changes
 */
export default function WebhookActionForm({ initialPayload, onChange }) {
  // Local state for form fields
  const [url, setUrl] = useState(initialPayload?.url || '');
  const [payload, setPayload] = useState(initialPayload?.payload || '');
  const [method, setMethod] = useState(initialPayload?.method || 'POST');
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  // Validate URL format
  const validateUrl = (url) => {
    if (!url) return 'Webhook URL is required';
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') {
        return 'Please enter a valid HTTPS URL';
      }
    } catch {
      return 'Please enter a valid HTTPS URL';
    }
    return null;
  };

  // Validate JSON format
  const validateJson = (json) => {
    if (!json) return null;
    try {
      JSON.parse(json);
      return null;
    } catch {
      return 'Please enter valid JSON';
    }
  };

  // Format JSON with proper indentation
  const formatJson = (json) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return json;
    }
  };

  // Handle URL changes
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    const urlError = validateUrl(newUrl);
    setErrors(prev => ({ ...prev, url: urlError }));
  };

  // Handle payload changes
  const handlePayloadChange = (e) => {
    const newPayload = e.target.value;
    setPayload(newPayload);
    const jsonError = validateJson(newPayload);
    setErrors(prev => ({ ...prev, payload: jsonError }));

    // Format JSON if valid
    if (!jsonError) {
      const formatted = formatJson(newPayload);
      if (formatted !== newPayload) {
        setPayload(formatted);
      }
    }
  };

  // Handle method changes
  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  // Validate URL on mount and whenever it changes
  useEffect(() => {
    const urlError = validateUrl(url);
    setErrors(prev => ({ ...prev, url: urlError }));
  }, [url]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      const hasErrors = Object.values(errors).some(error => error !== null);
      if (!hasErrors) {
        onChange({
          url,
          method,
          payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
  }, [url, method, payload, errors, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhook-url">Webhook URL</Label>
        <Input
          id="webhook-url"
          type="url"
          placeholder="https://api.example.com/webhook"
          value={url}
          onChange={handleUrlChange}
          className={errors.url ? 'border-red-500' : ''}
        />
        {errors.url && (
          <p className="text-sm text-red-500">{errors.url}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="request-method">Request Method</Label>
        <select
          id="request-method"
          value={method}
          onChange={handleMethodChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="json-payload">JSON Payload</Label>
        <Textarea
          id="json-payload"
          placeholder="Enter JSON payload"
          value={payload}
          onChange={handlePayloadChange}
          className={`font-mono ${errors.payload ? 'border-red-500' : ''}`}
          rows={8}
        />
        {errors.payload && (
          <p className="text-sm text-red-500">{errors.payload}</p>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Tips:</p>
        <ul className="list-disc list-inside">
          <li>Use HTTPS URLs only</li>
          <li>Enter valid JSON in the payload field</li>
          <li>You can use variables like {"{amount}"} in the payload</li>
        </ul>
      </div>
    </div>
  );
}

export { WebhookActionForm }; 


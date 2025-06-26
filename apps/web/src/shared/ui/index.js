// apps/web/src/components/ui/index.js
// This barrel file re-exports all UI components from their respective files.
// It allows for a consistent import pattern across the codebase, making it easier to manage and use UI components.

export { Button } from './Button';
export { Input } from './Input';
export { Label } from './Label';
export { Select, SelectTrigger, SelectContent, SelectItem } from './Select';
export { Card } from './Card';
export { Badge } from './badge';
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
export { RadioGroup, RadioGroupItem } from './radio-group';
export { Switch } from './switch';
export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './table';
export { Textarea } from './textarea';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
export { useToast } from './use-toast';
// Add other components as needed 

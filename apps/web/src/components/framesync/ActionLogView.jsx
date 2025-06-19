/**
 * ActionLogView.jsx
 * A component that displays the history of executed actions
 * Provides a clear audit trail for all FrameSync operations
 */

import React, { useMemo } from 'react';
import { useLogStore } from '@/lib/store/logStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

/**
 * ActionLogView Component
 * @returns {JSX.Element} The rendered component
 */
function ActionLogView() {
  const actionLog = useLogStore(state => state.actionLog);
  
  const sortedLog = useMemo(() => {
    return [...actionLog].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [actionLog]);

  const getStatusBadge = (status) => {
    const variants = {
      success: 'success',
      error: 'destructive',
      pending: 'warning',
      cancelled: 'secondary'
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss');
  };

  const formatPayload = (payload) => {
    if (!payload) return '-';
    return JSON.stringify(payload, null, 2);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Action Log</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Memo</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLog.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{formatTimestamp(entry.timestamp)}</TableCell>
                <TableCell>{entry.actionType}</TableCell>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell>
                  <pre className="whitespace-pre-wrap text-sm">
                    {formatPayload(entry.payload)}
                  </pre>
                </TableCell>
                <TableCell>
                  {entry.error ? (
                    <span className="text-red-500">{entry.error}</span>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm">
                      {formatPayload(entry.result)}
                    </pre>
                  )}
                </TableCell>
                <TableCell>{entry.payload?.memo || '—'}</TableCell>
                <TableCell>{entry.type}</TableCell>
              </TableRow>
            ))}
            {sortedLog.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No actions have been executed yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ActionLogView; 

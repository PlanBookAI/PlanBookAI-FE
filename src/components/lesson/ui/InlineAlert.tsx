interface InlineAlertProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

export function InlineAlert({ type = 'error', message }: InlineAlertProps) {
  const styles: Record<string, string> = {
    error: 'bg-red-500/15 text-red-100 border border-red-400/30',
    warning: 'bg-yellow-500/15 text-yellow-100 border border-yellow-400/30',
    info: 'bg-blue-500/15 text-blue-100 border border-blue-400/30',
    success: 'bg-green-500/15 text-green-100 border border-green-400/30'
  };

  const icon = {
    error: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    warning: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/>
      </svg>
    ),
    success: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
      </svg>
    )
  } as const;

  return (
    <div className={`flex items-start space-x-2 px-4 py-3 rounded-md ${styles[type]}`}>
      <div className="mt-0.5">{icon[type]}</div>
      <p className="text-sm leading-5">{message}</p>
    </div>
  );
}




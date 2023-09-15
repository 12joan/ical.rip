import React, { useMemo } from 'react';

import { Label } from '@/components/ui/label';
import { CalendarEvent, ValidationError } from '@/types';

export interface FormFieldProps {
  label: string;
  labelPosition?: 'before' | 'after';
  field: keyof CalendarEvent;
  validationErrors: ValidationError[];
  children: (props: { id: string; 'aria-invalid': boolean }) => React.ReactNode;
}

export const FormField = ({
  label,
  labelPosition = 'before',
  field,
  validationErrors,
  children,
}: FormFieldProps) => {
  const fieldErrors = useMemo(
    () => validationErrors.filter((error) => error.field === field),
    [validationErrors, field]
  );

  const labelElement = <Label htmlFor={field}>{label}</Label>;

  return (
    <div className="space-y-1">
      {labelPosition === 'before' && labelElement}

      <div className="flex items-center gap-2">
        {children({
          id: field,
          'aria-invalid': fieldErrors.length > 0,
        })}

        {labelPosition === 'after' && labelElement}
      </div>

      {fieldErrors.map((error) => (
        <p key={error.message} className="text-primary text-sm" role="alert">
          {error.message}
        </p>
      ))}
    </div>
  );
};

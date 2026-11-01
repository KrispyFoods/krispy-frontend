'use client';

import { useState } from 'react';
import { FormCard } from '@/components/molecules';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui';
import { useLogin } from '@/hooks/useLogin';
import { PIN_LENGTH } from '@/lib/auth/constants';
import { pinSchema, toFieldErrors } from '@/lib/schemas';

export function LoginForm() {
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const login = useLogin({
    onFieldErrors: (fieldErrors) => {
      setErrors(fieldErrors);
      setPin(''); // a wrong PIN is retyped from scratch
    },
  });

  const handleClear = () => {
    setPin('');
    setErrors({});
  };

  const handleSubmit = () => {
    const parsed = pinSchema.safeParse({ pin });
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    login.mutate(parsed.data.pin);
  };

  return (
    <FormCard
      title="Sign in"
      description={`Enter the ${PIN_LENGTH}-digit admin PIN.`}
      submitLabel="Sign in"
      pendingLabel="Signing in..."
      pending={login.isPending}
      onSubmit={handleSubmit}
      onClear={handleClear}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(errors.pin)}>
          <FieldLabel htmlFor="admin-pin">PIN</FieldLabel>
          <InputOTP
            id="admin-pin"
            maxLength={PIN_LENGTH}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            autoFocus
            value={pin}
            onChange={setPin}
            disabled={login.isPending}
            aria-invalid={Boolean(errors.pin)}
          >
            <InputOTPGroup>
              {Array.from({ length: PIN_LENGTH }, (_, i) => (
                <InputOTPSlot key={i} index={i} className="size-11 text-lg" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldError>{errors.pin}</FieldError>
        </Field>
      </FieldGroup>
    </FormCard>
  );
}

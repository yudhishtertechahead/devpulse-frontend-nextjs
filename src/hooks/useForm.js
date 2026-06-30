'use client';

import { useState, useCallback } from 'react';

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      // Validate on change only if field has been touched
      // We use setErrors with functional update to have latest touched state,
      // but simpler is to just validate the new values entirely.
      setErrors(validate(newValues));
      return newValues;
    });
  }, [validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    // We need to validate using the latest values to avoid stale closures.
    setValues(prev => {
      setErrors(validate(prev));
      return prev;
    });
  }, [validate]);

  const handleSubmit = useCallback((onSubmit) => (e) => {
    e.preventDefault();
    const allErrors = validate(values);
    setErrors(allErrors);
    setTouched(
      Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    if (Object.keys(allErrors).length === 0) {
      onSubmit(values);
    }
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset };
}

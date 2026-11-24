"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { AuthError, type FieldErrors } from "@/lib/auth";

export function useAuthForm(action: (data: FormData) => Promise<unknown>) {
  const router = useRouter();
  const submitting = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const data = new FormData(event.currentTarget);
    submitting.current = true;
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      await action(data);
      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
        setFieldErrors(error.errors);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return { handleSubmit, isSubmitting, error, fieldErrors };
}

import { useState } from 'react';
import { inquiriesApi } from '../utils/api';

const EMPTY_FORM = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

const validate = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'Name is required';
  if (!formData.email.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
  if (!formData.service) errors.service = 'Please select a service';
  if (!formData.message.trim()) errors.message = 'Message is required';
  return errors;
};

export function useContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '', submit: '' }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await inquiriesApi.create({
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service.trim(),
        subject: formData.service.trim() || 'Client inquiry',
        message: formData.message.trim(),
      });
      setSubmitSuccess(true);
      setFormData(EMPTY_FORM);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: 'Unable to send your message right now. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    handleInputChange,
    handleSubmit,
  };
}

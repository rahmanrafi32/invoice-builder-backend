/**
 * Password validation utility
 * Enforces strong password requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  HAS_LOWERCASE: /(?=.*[a-z])/,
  HAS_UPPERCASE: /(?=.*[A-Z])/,
  HAS_NUMBER: /(?=.*\d)/,
  HAS_SPECIAL: /(?=.*[!@#$%^&*])/,
};

/**
 * Validates password against security requirements
 * @param password - The password to validate
 * @returns Validation result with isValid flag and error messages
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Check if password is provided
  if (!password || !password.trim()) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
    );
  }

  // Check for lowercase letter
  if (!PASSWORD_REQUIREMENTS.HAS_LOWERCASE.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for uppercase letter
  if (!PASSWORD_REQUIREMENTS.HAS_UPPERCASE.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for number
  if (!PASSWORD_REQUIREMENTS.HAS_NUMBER.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (!PASSWORD_REQUIREMENTS.HAS_SPECIAL.test(password)) {
    errors.push(
      'Password must contain at least one special character (!@#$%^&*)',
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Helper function to get password requirements as a user-friendly string
 */
export function getPasswordRequirementsText(): string {
  return `Password must contain:
- At least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters
- At least one lowercase letter (a-z)
- At least one uppercase letter (A-Z)
- At least one number (0-9)
- At least one special character (!@#$%^&*)`;
}

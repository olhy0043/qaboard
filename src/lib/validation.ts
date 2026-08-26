/** FR-007/FR-008/FR-017: 공백 제거 후 길이 검증. */
export function validateLength(value: string, min: number, max: number): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    return `${min}~${max}자로 입력해주세요.`;
  }
  return undefined;
}

export const validateTitle = (value: string) => validateLength(value, 1, 100);
export const validateContent = (value: string) => validateLength(value, 1, 5000);
export const validateAnswer = (value: string) => validateLength(value, 1, 5000);

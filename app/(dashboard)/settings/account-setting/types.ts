export interface AccountProfile {
  firstName: string;
  lastName: string;
  agentCompany: string;
  phoneNumber: string;
  profileImage?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountSettingResponse {
  success: boolean;
  message: string;
}

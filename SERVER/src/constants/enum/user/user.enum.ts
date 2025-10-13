export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum UserStatus {
  WORKING = 1,
  TERMINATED = 2,
  PROBATION = 3
}

export enum UserGender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3
}

export enum UserRole {
  ADMIN = 1,
  MANAGER = 2,
  USER = 3
}

export const UserRoleString: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'admin',
  [UserRole.MANAGER]: 'manager',
  [UserRole.USER]: 'common'
}

export enum UserPosition {
  HUMAN_RESOURCE = 1,
  DEVELOPER = 2,
  EDITOR = 3,
  DESIGNER = 4,
  FACEBOOK_ADVERTISER = 5,
  MARKETING = 6,
  CONTENT_CREATOR = 7,
  ACCOUNTANT = 8,
  SEO = 9,
  TELESALES = 10,
  PANCAKE = 11,
  NOT_SPECIFIED = 12
}

export enum UserTitles {
  DIRECTOR = 1,
  LEADER = 2,
  EMPLOYEE = 3,
  INTERN = 4,
  OTHER = 5
}

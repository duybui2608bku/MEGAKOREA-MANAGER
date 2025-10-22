export const DEPARTMENT_MESSAGES = {
  CREATE_SUCCESS: 'Department created successfully',
  GET_ALL_SUCCESS: 'Departments retrieved successfully',
  GET_BY_ID_SUCCESS: 'Department retrieved successfully',
  UPDATE_SUCCESS: 'Department updated successfully',
  DELETE_SUCCESS: 'Department deleted successfully',
  DEPARTMENT_NOT_FOUND: 'Department not found',
  DEPARTMENT_NAME_ALREADY_EXISTS: 'Department name already exists',
  CANNOT_DELETE_DEPARTMENT_WITH_ASSIGNED_USERS:
    'Cannot delete department with assigned users. Please reassign users first.',
  NAME_REQUIRED: 'Department name is required',
  NAME_MUST_BE_STRING: 'Department name must be a string',
  NAME_LENGTH: 'Department name must be between 1 and 255 characters',
  DESCRIPTION_MUST_BE_STRING: 'Department description must be a string',
  ID_REQUIRED: 'Department ID is required',
  STATUS_INVALID_VALUE: 'Status must be 1 (active) or 0 (inactive)',
  CODE_MUST_BE_STRING: 'Department code must be a string',
  ASSIGNED_MENUS_MUST_BE_AN_ARRAY: 'Assigned menus must be an array'
}

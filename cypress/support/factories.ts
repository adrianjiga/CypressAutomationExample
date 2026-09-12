import { faker } from "@faker-js/faker";
import type { FormUserData, UserData } from "../types/models";

/**
 * Factory for generating test user data.
 * Provides randomized but valid test data for forms and tables.
 */
export const userFactory = {
  /**
   * Generate a complete user object for WebTables, with specific fields
   * optionally overridden.
   */
  generate(overrides: Partial<UserData> = {}): UserData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      age: faker.number.int({ min: 18, max: 65 }).toString(),
      salary: faker.number.int({ min: 1000, max: 150000 }).toString(),
      department: faker.commerce.department(),
      ...overrides,
    };
  },

  /**
   * Generate user data for the practice registration form, with specific
   * fields optionally overridden.
   */
  generateFormUser(overrides: Partial<FormUserData> = {}): FormUserData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      mobile: faker.string.numeric(10),
      address: faker.location.streetAddress(),
      ...overrides,
    };
  },

  /**
   * Generate a random age within the given range.
   */
  generateAge(min = 18, max = 65): number {
    return faker.number.int({ min, max });
  },
};

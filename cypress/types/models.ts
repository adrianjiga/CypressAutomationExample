/**
 * Shared test-data models for the suite.
 *
 * Kept as plain data interfaces so a type can be reused verbatim by the page
 * objects, the test-data factories, and the specs without spreading type
 * definitions across four locations.
 */

/**
 * A complete WebTables record as entered through the "Add / Edit Record" form.
 * Age and salary are strings on purpose: the app renders them as text and the
 * pages assert on `.should("contain", value)`.
 */
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

/**
 * A row as read back from the rendered table via `getRowData` / `getFirstRowData`.
 */
export interface RowData {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  salary: string;
  department: string;
}

/**
 * The complete data `userFactory.generateFormUser()` produces for the Practice
 * Form helper page.
 */
export interface FormUserData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
}

export type Gender = "male" | "female" | "other";

export type Hobby = "sports" | "reading" | "music";

export type StateName =
  | "Germany"
  | "France"
  | "Spain"
  | "Italy"
  | "Netherlands";

export interface DateOfBirth {
  month: string; // e.g. "January"
  year: string; // e.g. "1990"
  day: string; // zero-padded, e.g. "01"
}

/**
 * Input accepted by the Practice Form helper page. Every field is optional
 * because the page's fill methods are guarded: the spec decides how much of the
 * form to complete (validation-error tests submit an empty form, the
 * accessibility spec submits the minimum required fields).
 */
export interface RegisterFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  address?: string;
  gender?: Gender;
  dateOfBirth?: DateOfBirth;
  subjects?: string[];
  hobbies?: Hobby[];
  picture?: string;
  state?: StateName;
  city?: string;
}

/** Anything the JSONPlaceholder API returns that carries an id. */
export interface ApiIdentifiable {
  id: number;
}

export interface Post extends ApiIdentifiable {
  userId: number;
  title: string;
  body: string;
}

export interface Comment extends ApiIdentifiable {
  postId: number;
  name: string;
  email: string;
  body: string;
}

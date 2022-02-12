import { Customers } from '../classes/Customers';
let customers: Customers = new Customers();

describe("check IDs", () => {
  let invalidCustomerIDs : Array<string> = ["1234","3d2"];
  let validCustomerIDs : Array<string> = ["111","999"];
  for(let id of invalidCustomerIDs) {
    test("check invalid customer IDs", () => {
      expect(customers.checkExistenceAndCharacters(id)).toBeFalsy();
    });
  }

  for(let id of validCustomerIDs) {
    test("check valid customer IDs", () => {
      expect(customers.checkExistenceAndCharacters(id)).toBeTruthy();
    });
  }
});
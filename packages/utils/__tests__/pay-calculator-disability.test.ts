/**
 * @file pay-calculator-disability.test.ts
 * @description Unit tests for the Pay calculator disability logic in pay-calculator.ts.
 */

import { calculateNetPayWithDisability } from "../src/pay-calculator";

describe("Pay Calculator - Disability", () => {
  describe("calculateNetPayWithDisability", () => {
    it("should choose military pay when it is higher than VA disability pay", () => {
      const result = calculateNetPayWithDisability(5000, 3000);
      expect(result.paySource).toEqual("Military");
      expect(result.takeHomePay).toEqual(5000);
    });

    it("should choose VA disability pay when it is higher than military pay", () => {
      const result = calculateNetPayWithDisability(3000, 5000);
      expect(result.paySource).toEqual("VA Disability");
      expect(result.takeHomePay).toEqual(5000);
    });

    it("should choose military pay when military pay and VA disability pay are equal", () => {
      const result = calculateNetPayWithDisability(4000, 4000);
      expect(result.paySource).toEqual("Military");
      expect(result.takeHomePay).toEqual(4000);
    });

    it("should handle zero military pay", () => {
      const result = calculateNetPayWithDisability(0, 3000);
      expect(result.paySource).toEqual("VA Disability");
      expect(result.takeHomePay).toEqual(3000);
    });

    it("should handle zero VA disability pay", () => {
      const result = calculateNetPayWithDisability(5000, 0);
      expect(result.paySource).toEqual("Military");
      expect(result.takeHomePay).toEqual(5000);
    });

    it("should handle both pays being zero", () => {
      const result = calculateNetPayWithDisability(0, 0);
      expect(result.paySource).toEqual("Military");
      expect(result.takeHomePay).toEqual(0);
    });
  });
});

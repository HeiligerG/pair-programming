import { calculatePayslip, Salary, DEDUCTION_RATES } from "./payroll";

test("Ein 16 jähriger Lernender mit einem Monatsgehalt von 700.-", () => {
    const salary: Salary = {
        born: new Date(2009, 5, 15),
        payday: new Date(2025, 4, 30),
        gross: 700
    };

    const payslip = calculatePayslip(salary);

    // AHV, IV und EO werden nicht bei 16 Jährigen abgezogen
    expect(payslip.deductions.has("AHV")).toBe(false);
    expect(payslip.deductions.has("IV")).toBe(false);
    expect(payslip.deductions.has("EO")).toBe(false);

    // Soabld jahresloh über 2500 werden abgezogen
    expect(payslip.deductions.has("ALV")).toBe(true);
    expect(payslip.deductions.has("NBU")).toBe(true);

    // ab jahreslohn 22680 wird es abgezogen
    expect(payslip.deductions.has("PK")).toBe(false);

    const alv = 700 * (DEDUCTION_RATES.get("ALV") / 100);
    const nbu = 700 * (DEDUCTION_RATES.get("NBU") / 100);
    const totalExpected = alv + nbu;

    expect(payslip.totalDeductions).toBeCloseTo(totalExpected, 2);
    expect(payslip.net).toBeCloseTo(700 - totalExpected, 2)
});
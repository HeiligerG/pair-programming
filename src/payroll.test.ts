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

test("Ein 18 jähriger Lernender mit einem Monatsgehalt von 1200.-", () => {
    const salary: Salary = {
        born: new Date(2007, 2, 15),
        payday: new Date(2025, 4, 30),
        gross: 1200
    };

    const payslip = calculatePayslip(salary);

    // AHV, IV und EO werden bei 18 Jährigen abgezogen
    expect(payslip.deductions.has("AHV")).toBe(true);
    expect(payslip.deductions.has("IV")).toBe(true);
    expect(payslip.deductions.has("EO")).toBe(true);

    // Soabld jahresloh über 2500 werden abgezogen
    expect(payslip.deductions.has("ALV")).toBe(true);
    expect(payslip.deductions.has("NBU")).toBe(true);

    // ab jahreslohn 22680 wird es abgezogen
    expect(payslip.deductions.has("PK")).toBe(false);

    const ahv = 1200 * (DEDUCTION_RATES.get("AHV") / 100);
    const iv = 1200 * (DEDUCTION_RATES.get("IV") / 100);
    const eo = 1200 * (DEDUCTION_RATES.get("EO") / 100);
    const alv = 1200 * (DEDUCTION_RATES.get("ALV") / 100);
    const nbu = 1200 * (DEDUCTION_RATES.get("NBU") / 100);
    const totalExpected = alv + nbu + iv + ahv + eo;

    expect(payslip.totalDeductions).toBeCloseTo(totalExpected, 2);
    expect(payslip.net).toBeCloseTo(1200 - totalExpected, 2)
});


test("ein 21 jähriger Angestellter mit einem Monatsgehalt von 5900.-", () => {
    const salary: Salary = {
        born: new Date(2004, 0, 15),
        payday: new Date(2025, 4, 30),
        gross: 5900
    };

    const payslip = calculatePayslip(salary);

    // AHV, IV und EO werden bei 18 Jährigen abgezogen
    expect(payslip.deductions.has("AHV")).toBe(true);
    expect(payslip.deductions.has("IV")).toBe(true);
    expect(payslip.deductions.has("EO")).toBe(true);

    // Soabld jahresloh über 2500 werden abgezogen
    expect(payslip.deductions.has("ALV")).toBe(true);
    expect(payslip.deductions.has("NBU")).toBe(true);

    // ab jahreslohn 22680 wird es abgezogen
    expect(payslip.deductions.has("PK")).toBe(true);

    const ahv = 5900 * (DEDUCTION_RATES.get("AHV") / 100);
    const iv = 5900 * (DEDUCTION_RATES.get("IV") / 100);
    const eo = 5900 * (DEDUCTION_RATES.get("EO") / 100);
    const alv = 5900 * (DEDUCTION_RATES.get("ALV") / 100);
    const nbu = 5900 * (DEDUCTION_RATES.get("NBU") / 100);
    const pk = 5900 * (DEDUCTION_RATES.get("PK") / 100);
    const totalExpected = alv + nbu + iv + ahv + eo + pk;

    expect(payslip.totalDeductions).toBeCloseTo(totalExpected, 2);
    expect(payslip.net).toBeCloseTo(5900 - totalExpected, 2)
});
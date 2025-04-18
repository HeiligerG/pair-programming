export type Salary = {
  born: Date;
  payday: Date;
  gross: number;
};

export type Deductions = Map<string, number>;

export const DEDUCTION_RATES: Deductions = new Map([
  ["AHV", 8.7],
  ["IV", 1.4],
  ["EO", 0.5],
  ["ALV", 1.1],
  ["NBU", 0.73],
  ["PK", 8.9],
]);

export type Payslip = {
  salary: Salary;
  deductions: Deductions;
  totalDeductions: number;
  net: number;
};

export function calculatePayslip(salary: Salary): Payslip {
  // TODO: implement

  const deductions = new Map<string, number>
  let totalDeductions = 0.0 

  const birthYear = salary.born.getFullYear();
  const payYear = salary.payday.getFullYear();
  const age = payYear - birthYear
  const birthdayThisYear = new Date(payYear, salary.born.getMonth(), salary.born.getDate());
  const isOver17AfterJan1 = age > 17 || (age === 17 && salary.payday >= birthdayThisYear && salary.payday > new Date(payYear, 0, 1)); 

  const annualSalary = salary.gross * 12;

  if (isOver17AfterJan1) {
    deductions.set("AHV", (salary.gross * DEDUCTION_RATES.get("AHV") / 100));
    deductions.set("IV", (salary.gross * DEDUCTION_RATES.get("IV") / 100));
    deductions.set("EO", (salary.gross * DEDUCTION_RATES.get("EO") / 100));
  }

  if (annualSalary >= 2500) {
    deductions.set("ALV", (salary.gross * DEDUCTION_RATES.get("ALV") / 100));
    deductions.set("NBU", (salary.gross * DEDUCTION_RATES.get("NBU") / 100));
  }

  if (annualSalary >= 22680) {
    deductions.set("PK", (salary.gross * DEDUCTION_RATES.get("PK") / 100));
  }

  deductions.forEach(value => {
    totalDeductions += value
  });

  return {
    salary: salary,
    deductions: deductions,
    totalDeductions: totalDeductions,
    net: salary.gross - totalDeductions
  }
}
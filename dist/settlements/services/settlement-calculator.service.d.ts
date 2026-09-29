import { SettlementCalculationInput, SettlementCalculationResult } from '../interfaces/settlement-calculation.interface';
export declare class SettlementCalculatorService {
    private readonly IVA_RATE;
    calculate(input: SettlementCalculationInput): SettlementCalculationResult;
    private addBusinessDays;
    private roundToTwoDecimals;
}

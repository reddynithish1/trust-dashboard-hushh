import { IConnectedApp } from '../models/App';

export const calculateTrustScore = (apps: IConnectedApp[]): number => {
  if (!apps || apps.length === 0) return 100;

  let deduction = 0;

  apps.forEach(app => {
    // Risk Baseline
    if (app.riskLevel === 'Risky') deduction += 15;
    if (app.riskLevel === 'Moderate') deduction += 5;

    // Over-permission deduction
    const grantedPerms = app.permissions.filter(p => p.isGranted).length;
    if (grantedPerms > 5) deduction += 5;
    
    // Unnecessary exposure deduction
    if (app.usageFrequency === 'Rarely' && grantedPerms > 2) {
      deduction += 10;
    }
  });

  const finalScore = 100 - deduction;
  return finalScore < 0 ? 0 : (finalScore > 100 ? 100 : finalScore);
};

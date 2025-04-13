export function getExpectedGroup(income: number): string {
    if (!income || income <= 2100) return '0 bis 2.100 €';
    if (income <= 2500) return '2.101 - 2.500 €';
    if (income <= 2900) return '2.501 - 2.900 €';
    if (income <= 3300) return '2.901 - 3.300 €';
    if (income <= 3700) return '3.301 - 3.700 €';
    if (income <= 4100) return '3.701 - 4.100 €';
    if (income <= 4500) return '4.101 - 4.500 €';
    if (income <= 4900) return '4.501 - 4.900 €';
    if (income <= 5300) return '4.901 - 5.300 €';
    if (income <= 5700) return '5.301 - 5.700 €';
    if (income <= 6400) return '5.701 - 6.400 €';
    if (income <= 7200) return '6.401 - 7.200 €';
    if (income <= 8200) return '7.201 - 8.200 €';
    if (income <= 9700) return '8.201 - 9.700 €';
    if (income <= 11200) return '9.701 - 11.200 €';
    return 'Über 11.200 €';
} 
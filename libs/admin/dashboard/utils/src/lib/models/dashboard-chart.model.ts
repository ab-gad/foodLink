export interface ChartItem {
    label: string;
    value: number;
    percentage: number;
    color: string;
}

export interface DashboardChartsData {
    reservations: {
        total: number;
        items: ChartItem[];
    };
    users: {
        total: number;
        items: ChartItem[];
    };
}
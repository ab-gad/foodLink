import { ChartItem } from "@foodlink/shared-util";
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
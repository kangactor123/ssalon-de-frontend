import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

import {
  Calendar,
  ChartLine,
  Contact,
  DollarSign,
  Goal,
  PersonStanding,
  ShoppingCart,
  Target,
  Users,
} from "lucide-react";
import MonthPicker from "./components/month-picker";
import dynamic from "next/dynamic";
import withSuspense from "@/shared/hoc/with-suspense";
import TotalSalesWidgetSkeleton from "./components/total-sales-widget-skeleton";
import DailyTargetWidgetSkeleton from "./components/daily-target-widget-skeleton";
import AverageCustomerSpendingWidgetSkeleton from "./components/average-customer-spending-widget-skeleton";

const DashboardHeader = dynamic(() => import("./components/dashboard-header"));
const CalendarWidget = dynamic(() => import("./components/calendar-widget"));
const GenderRatioWidget = dynamic(
  () => import("./components/gender-ratio-widget")
);

const DailySalesLineChart = dynamic(
  () => import("./components/daily-sales-line-chart")
);

const TotalSalesWidget = dynamic(
  () => import("./components/total-sales-widget")
);

const TargetTotalSalesWidget = dynamic(
  () => import("./components/target-total-sales-widget")
);

const VisitTypesRatioWidget = dynamic(
  () => import("./components/visit-type-ratio-widget")
);

const DailyTargetWidget = dynamic(
  () => import("./components/daily-target-widget")
);

const AverageCustomerSpendingWidget = dynamic(
  () => import("./components/average-customer-spending-widget")
);

const TotalSalesCountWidget = dynamic(
  () => import("./components/total-sales-count-widget")
);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {withSuspense(
        <DashboardHeader>
          <MonthPicker />
        </DashboardHeader>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="max-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              총 매출액
              <DollarSign className="w-5 h-5 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            {withSuspense(<TotalSalesWidget />, TotalSalesWidgetSkeleton)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              목표 달성을 위한 일일 매출
              <Target className="w-5 h-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withSuspense(<DailyTargetWidget />, DailyTargetWidgetSkeleton)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              고객 평균 단가
              <Users className="w-5 h-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withSuspense(
              <AverageCustomerSpendingWidget />,
              AverageCustomerSpendingWidgetSkeleton
            )}
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              캘린더
              <Calendar className="w-5 h-5 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>{withSuspense(<CalendarWidget />)}</CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                목표 매출
                <Goal className="w-5 h-5 text-blue-900" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withSuspense(<TargetTotalSalesWidget />)}
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle>총 매출 건수</CardTitle>
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>{withSuspense(<TotalSalesCountWidget />)}</CardContent>
          </Card>
        </div>
        <Card className="flex flex-col min-h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              성별 비율
              <PersonStanding className="w-5 h-5 text-red-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {withSuspense(<GenderRatioWidget />)}
          </CardContent>
        </Card>
        <Card className="flex flex-col min-h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              방문 유형 비율
              <Contact className="w-5 h-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {withSuspense(<VisitTypesRatioWidget />)}
          </CardContent>
        </Card>
        <Card className="hidden col-span-2 md:block">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              일별 매출 건수
              <ChartLine className="w-5 h-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>{withSuspense(<DailySalesLineChart />)}</CardContent>
        </Card>
      </div>
    </div>
  );
}

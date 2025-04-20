import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CalendarWidget } from "./components/calendar-widget";
import { GenderRatioWidget } from "./components/gender-ratio-widget";
import { DailySalesLineChart } from "./components/daily-sales-line-chart";
import { TotalSalesWidget } from "./components/total-sales-widget";
import { TargetTotalSalesWidget } from "./components/target-total-sales-widget";
import { VisitTypesRatioWidget } from "./components/visit-type-ratio-widget";
import { DailyTargetWidget } from "./components/daily-target-widget";
import { AverageCustomerSpendingWidget } from "./components/average-customer-spending-widget";
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
import { TotalSalesCountWidget } from "./components/total-sales-count-widget";
import MonthPicker from "./components/month-picker";
import DashboardHeader from "./components/dashboard-header";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <DashboardHeader>
        <MonthPicker />
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="max-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              총 매출액
              <DollarSign className="w-5 h-5 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto">
            <TotalSalesWidget />
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
            <DailyTargetWidget />
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
            <AverageCustomerSpendingWidget />
          </CardContent>
        </Card>
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              캘린더
              <Calendar className="w-5 h-5 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarWidget />
          </CardContent>
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
              <TargetTotalSalesWidget />
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle>총 매출 건수</CardTitle>
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <TotalSalesCountWidget />
            </CardContent>
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
            <GenderRatioWidget />
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
            <VisitTypesRatioWidget />
          </CardContent>
        </Card>
        <Card className="hidden col-span-2 md:block">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              일별 매출 건수
              <ChartLine className="w-5 h-5 text-blue-700" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailySalesLineChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

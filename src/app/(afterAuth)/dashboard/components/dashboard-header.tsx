"use client";

import useDateStore from "@/zustand/date";

type Props = React.PropsWithChildren;

const DashboardHeader: React.FC<Props> = ({ children }) => {
  const date = useDateStore((state) => state.date);
  const getMonth = useDateStore((state) => state.getMonth);
  const selectedMonth = getMonth(date);

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
        대시보드
        <span className="text-2xl ml-2">({selectedMonth}월)</span>
      </h2>
      {children}
    </div>
  );
};

export default DashboardHeader;

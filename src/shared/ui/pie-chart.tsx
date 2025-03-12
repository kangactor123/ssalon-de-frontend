import { ContentType } from "recharts/types/component/DefaultLegendContent";
import {
  PieChart as RechartPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  PieProps,
} from "recharts";
import { CHART_COLORS } from "../constants/palette";

type Props = {
  colors?: string[];
  customLegend?: ContentType;
} & Omit<PieProps, "ref">;

const PieChart: React.FC<Props> = ({
  data,
  colors = CHART_COLORS,
  customLegend,
  ...props
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartPieChart>
        <Pie
          cx="50%"
          cy="45%"
          innerRadius={40}
          outerRadius={50}
          data={data}
          {...props}
        >
          {data?.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              style={{ outline: "none" }}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Legend content={customLegend} wrapperStyle={{ bottom: 15 }} />
      </RechartPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;

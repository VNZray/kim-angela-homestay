import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

interface PieChartItem {
  id: string;
  value: number;
  label: string;
  color?: string;
}

interface DashboardPieChartProps {
  data: PieChartItem[];
  height?: number;
  innerRadius?: number;
  paddingAngle?: number;
  cornerRadius?: number;
}

export default function DashboardPieChart({
  data,
  height = 260,
  innerRadius = 40,
  paddingAngle = 2,
  cornerRadius = 4,
}: DashboardPieChartProps) {
  return (
    <PieChart
      height={height}
      series={[
        {
          data,
          innerRadius,
          paddingAngle,
          cornerRadius,
          arcLabel: (item) => `${item.value}%`,
          arcLabelMinAngle: 35,
          arcLabelRadius: "60%",
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fontWeight: "bold",
        },
      }}
    />
  );
}

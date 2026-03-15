import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

interface PieItem {
  id: string | number;
  value: number;
  label: string;
  color?: string;
}

interface BasicPieProps {
  data?: PieItem[];
  height?: number;
  width?: number;
  /** "basic" — simple pie | "donut" — donut with arc labels */
  variant?: "basic" | "donut";
}

const DEFAULT_DATA: PieItem[] = [
  { id: 0, value: 10, label: "series A" },
  { id: 1, value: 15, label: "series B" },
  { id: 2, value: 20, label: "series C" },
];

export default function BasicPie({
  data = DEFAULT_DATA,
  height = 200,
  width = 200,
  variant = "basic",
}: BasicPieProps) {
  const isDonut = variant === "donut";

  return (
    <PieChart
      width={width}
      height={height}
      series={[
        {
          data,
          ...(isDonut && {
            innerRadius: 40,
            paddingAngle: 2,
            cornerRadius: 4,
            arcLabel: (item) => `${item.value}%`,
            arcLabelMinAngle: 35,
            arcLabelRadius: "60%",
          }),
        },
      ]}
      sx={
        isDonut
          ? {
              [`& .${pieArcLabelClasses.root}`]: { fontWeight: "bold" },
            }
          : undefined
      }
    />
  );
}

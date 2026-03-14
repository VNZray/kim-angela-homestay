import { useState, useEffect, useMemo } from "react";
import { Box, useColorScheme } from "@mui/joy";
import { BarChart, PieChart, LineChart } from "@mui/x-charts";
import {
  TrendingUp,
  Hotel,
  People,
  AccountBalanceWallet,
  CalendarMonth,
  MeetingRoom,
  Star,
} from "@mui/icons-material";
import PageContainer from "@/components/PageContainer";
import Typography from "@/components/ui/Typography";
import Loading from "@/components/Loading";
import { getColors } from "@/utils/Colors";
import { getAllBookings } from "@/services/booking/BookingService";
import { getAllRooms } from "@/services/room/RoomService";
import { getAllTransactions } from "@/services/transaction/TransactionService";
import { getAllRoomReviews } from "@/services/reviews/RoomReviewService";
import type { Booking, BookingStatus, BookingSource } from "@/types/Booking";
import type { Room } from "@/types/Room";
import type {
  Transaction,
  PaymentMethod,
  TransactionStatus,
} from "@/types/Transaction";
import type { RoomReview } from "@/types/RoomReview";

// ─── Helpers ──────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function getMonthLabel(key: string) {
  const [y, m] = key.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  borderColor,
  cardBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  borderColor: string;
  cardBg: string;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "14px",
        border: `1px solid ${borderColor}`,
        backgroundColor: cardBg,
        display: "flex",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.softBg",
          color: "primary.plainColor",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography.Body size="xs" color="default">
          {label}
        </Typography.Body>
        <Typography.Header size="sm" bold>
          {value}
        </Typography.Header>
        {sub && (
          <Typography.Body size="xs" color="default">
            {sub}
          </Typography.Body>
        )}
      </Box>
    </Box>
  );
}

// ─── Chart Card ───────────────────────────────────────────
function ChartCard({
  title,
  children,
  borderColor,
  cardBg,
  span = 1,
}: {
  title: string;
  children: React.ReactNode;
  borderColor: string;
  cardBg: string;
  span?: number;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "14px",
        border: `1px solid ${borderColor}`,
        backgroundColor: cardBg,
        gridColumn: { xs: "span 1", md: `span ${span}` },
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography.Label size="sm" bold sx={{ mb: 2 }}>
        {title}
      </Typography.Label>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────
export const AccommodationDashboard = () => {
  const { mode } = useColorScheme();
  const c = getColors(mode);
  const borderColor = mode === "dark" ? "#374151" : "#e5e7eb";
  const cardBg = mode === "dark" ? "#1e1e1e" : "#fff";
  const textColor = mode === "dark" ? "#e5e7eb" : "#374151";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [b, r, t, rv] = await Promise.all([
          getAllBookings(),
          getAllRooms(),
          getAllTransactions(),
          getAllRoomReviews(),
        ]);
        setBookings(b);
        setRooms(r);
        setTransactions(t);
        setReviews(rv);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ─── Derived analytics ─────────────────────────────────
  const analytics = useMemo(() => {
    // Revenue
    const completedTx = transactions.filter(
      (t) => t.transaction_status === "completed",
    );
    const totalRevenue = completedTx.reduce((s, t) => s + t.amount, 0);
    const pendingRevenue = transactions
      .filter((t) => t.transaction_status === "pending")
      .reduce((s, t) => s + t.amount, 0);

    // Booking status breakdown
    const statusCounts: Record<BookingStatus, number> = {
      pending: 0,
      reserved: 0,
      checked_in: 0,
      checked_out: 0,
      cancelled: 0,
    };
    bookings.forEach((b) => {
      statusCounts[b.booking_status] =
        (statusCounts[b.booking_status] || 0) + 1;
    });

    // Booking source breakdown
    const sourceCounts: Record<BookingSource, number> = {
      online: 0,
      "walk-in": 0,
    };
    bookings.forEach((b) => {
      sourceCounts[b.booking_source] =
        (sourceCounts[b.booking_source] || 0) + 1;
    });

    // Payment method breakdown
    const paymentCounts: Record<PaymentMethod, number> = {
      cash: 0,
      gcash: 0,
      bank_transfer: 0,
      credit_card: 0,
      other: 0,
    };
    completedTx.forEach((t) => {
      paymentCounts[t.payment_method] =
        (paymentCounts[t.payment_method] || 0) + 1;
    });

    // Transaction status breakdown
    const txStatusCounts: Record<TransactionStatus, number> = {
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
    };
    transactions.forEach((t) => {
      txStatusCounts[t.transaction_status] =
        (txStatusCounts[t.transaction_status] || 0) + 1;
    });

    // Monthly revenue (last 12 months)
    const now = new Date();
    const last12 = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    });
    const monthlyRevenue: Record<string, number> = {};
    last12.forEach((k) => (monthlyRevenue[k] = 0));
    completedTx.forEach((t) => {
      const k = getMonthKey(t.created_at);
      if (monthlyRevenue[k] !== undefined) monthlyRevenue[k] += t.amount;
    });

    // Monthly bookings
    const monthlyBookings: Record<string, number> = {};
    last12.forEach((k) => (monthlyBookings[k] = 0));
    bookings.forEach((b) => {
      const k = getMonthKey(b.check_in_date);
      if (monthlyBookings[k] !== undefined) monthlyBookings[k]++;
    });

    // Occupancy rate (checked_in / total rooms)
    const activeBookings = bookings.filter(
      (b) =>
        b.booking_status === "checked_in" || b.booking_status === "reserved",
    );
    const occupiedRoomIds = new Set(activeBookings.map((b) => b.room_id));
    const occupancyRate =
      rooms.length > 0
        ? Math.round((occupiedRoomIds.size / rooms.length) * 100)
        : 0;

    // Average booking value
    const completedBookings = bookings.filter(
      (b) => b.booking_status === "checked_out",
    );
    const avgBookingValue =
      completedBookings.length > 0
        ? Math.round(
            completedBookings.reduce((s, b) => s + b.total_price, 0) /
              completedBookings.length,
          )
        : 0;

    // Guest demographics
    const totalGuests = bookings.reduce((s, b) => s + b.pax, 0);
    const totalAdults = bookings.reduce((s, b) => s + b.num_adults, 0);
    const totalChildren = bookings.reduce((s, b) => s + b.num_children, 0);
    const totalInfants = bookings.reduce((s, b) => s + b.num_infants, 0);
    const totalDomestic = bookings.reduce((s, b) => s + b.domestic_counts, 0);
    const totalForeign = bookings.reduce((s, b) => s + b.foreign_counts, 0);

    // Room performance (revenue per room)
    const roomRevenueMap: Record<string, number> = {};
    bookings.forEach((b) => {
      if (
        b.booking_status === "checked_out" ||
        b.booking_status === "checked_in"
      ) {
        roomRevenueMap[b.room_id] =
          (roomRevenueMap[b.room_id] || 0) + b.total_price;
      }
    });
    const roomPerformance = rooms
      .map((r) => ({
        name: r.room_number || r.id.slice(0, 6),
        revenue: roomRevenueMap[r.id] || 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Room type distribution
    const roomTypeCounts: Record<string, number> = {};
    rooms.forEach((r) => {
      const t = r.room_type || "Other";
      roomTypeCounts[t] = (roomTypeCounts[t] || 0) + 1;
    });

    // Average stay duration
    const stayDurations = completedBookings.map((b) =>
      daysBetween(b.check_in_date, b.check_out_date),
    );
    const avgStayDuration =
      stayDurations.length > 0
        ? (
            stayDurations.reduce((s, d) => s + d, 0) / stayDurations.length
          ).toFixed(1)
        : "0";

    // Reviews
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(
            1,
          )
        : "N/A";

    // Booking type (overnight vs short-stay)
    const overnightCount = bookings.filter(
      (b) => b.booking_type === "overnight",
    ).length;
    const shortStayCount = bookings.filter(
      (b) => b.booking_type === "short-stay",
    ).length;

    return {
      totalRevenue,
      pendingRevenue,
      statusCounts,
      sourceCounts,
      paymentCounts,
      txStatusCounts,
      monthlyRevenue,
      monthlyBookings,
      last12,
      occupancyRate,
      avgBookingValue,
      totalGuests,
      totalAdults,
      totalChildren,
      totalInfants,
      totalDomestic,
      totalForeign,
      roomPerformance,
      roomTypeCounts,
      avgStayDuration,
      avgRating,
      overnightCount,
      shortStayCount,
    };
  }, [bookings, rooms, transactions, reviews]);

  if (loading) return <Loading />;

  const CHART_PALETTE = [
    c.primary,
    c.info,
    c.success,
    c.secondary,
    c.error,
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
  ];

  return (
    <PageContainer sx={{ alignItems: "stretch" }}>
      {/* Header */}
      <Box>
        <Typography.Header size="sm" bold>
          Accommodation Dashboard
        </Typography.Header>
        <Typography.Body size="sm" color="default">
          Overview of your business performance
        </Typography.Body>
      </Box>

      {/* KPI Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        <StatCard
          icon={<AccountBalanceWallet />}
          label="Total Revenue"
          value={`₱${analytics.totalRevenue.toLocaleString()}`}
          sub={`₱${analytics.pendingRevenue.toLocaleString()} pending`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
        <StatCard
          icon={<CalendarMonth />}
          label="Total Bookings"
          value={bookings.length}
          sub={`${analytics.statusCounts.cancelled} cancelled`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
        <StatCard
          icon={<Hotel />}
          label="Occupancy Rate"
          value={`${analytics.occupancyRate}%`}
          sub={`${rooms.length} rooms total`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
        <StatCard
          icon={<TrendingUp />}
          label="Avg. Booking Value"
          value={`₱${analytics.avgBookingValue.toLocaleString()}`}
          sub={`${analytics.avgStayDuration} days avg stay`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
      </Box>

      {/* Secondary KPIs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        <StatCard
          icon={<People />}
          label="Total Guests"
          value={analytics.totalGuests}
          sub={`${analytics.totalAdults} adults`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
        <StatCard
          icon={<MeetingRoom />}
          label="Room Types"
          value={Object.keys(analytics.roomTypeCounts).length}
          sub={`${rooms.length} rooms`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
        <StatCard
          icon={<Star />}
          label="Avg. Rating"
          value={analytics.avgRating}
          sub={`${reviews.length} reviews`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
        <StatCard
          icon={<People />}
          label="Domestic / Foreign"
          value={`${analytics.totalDomestic} / ${analytics.totalForeign}`}
          sub={`${analytics.totalChildren} children, ${analytics.totalInfants} infants`}
          borderColor={borderColor}
          cardBg={cardBg}
        />
      </Box>

      {/* Charts Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {/* Monthly Revenue */}
        <ChartCard
          title="Monthly Revenue"
          borderColor={borderColor}
          cardBg={cardBg}
          span={2}
        >
          <LineChart
            height={280}
            series={[
              {
                data: analytics.last12.map((k) => analytics.monthlyRevenue[k]),
                label: "Revenue (₱)",
                color: c.primary,
                area: true,
              },
            ]}
            xAxis={[
              {
                data: analytics.last12.map(getMonthLabel),
                scaleType: "point",
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
          />
        </ChartCard>

        {/* Monthly Bookings */}
        <ChartCard
          title="Monthly Bookings"
          borderColor={borderColor}
          cardBg={cardBg}
          span={2}
        >
          <BarChart
            height={280}
            series={[
              {
                data: analytics.last12.map((k) => analytics.monthlyBookings[k]),
                label: "Bookings",
                color: c.info,
              },
            ]}
            xAxis={[
              {
                data: analytics.last12.map(getMonthLabel),
                scaleType: "band",
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
          />
        </ChartCard>

        {/* Booking Status */}
        <ChartCard
          title="Booking Status"
          borderColor={borderColor}
          cardBg={cardBg}
        >
          <PieChart
            height={260}
            series={[
              {
                data: Object.entries(analytics.statusCounts).map(
                  ([label, value], i) => ({
                    id: label,
                    value,
                    label: label.replace("_", " "),
                    color: CHART_PALETTE[i % CHART_PALETTE.length],
                  }),
                ),
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            slotProps={{
              legend: {
                labelStyle: { fill: textColor, fontSize: 12 },
              },
            }}
          />
        </ChartCard>

        {/* Booking Source */}
        <ChartCard
          title="Booking Source"
          borderColor={borderColor}
          cardBg={cardBg}
        >
          <PieChart
            height={260}
            series={[
              {
                data: Object.entries(analytics.sourceCounts).map(
                  ([label, value], i) => ({
                    id: label,
                    value,
                    label,
                    color: CHART_PALETTE[i % CHART_PALETTE.length],
                  }),
                ),
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            slotProps={{
              legend: {
                labelStyle: { fill: textColor, fontSize: 12 },
              },
            }}
          />
        </ChartCard>

        {/* Payment Methods */}
        <ChartCard
          title="Payment Methods"
          borderColor={borderColor}
          cardBg={cardBg}
        >
          <PieChart
            height={260}
            series={[
              {
                data: Object.entries(analytics.paymentCounts)
                  .filter(([, v]) => v > 0)
                  .map(([label, value], i) => ({
                    id: label,
                    value,
                    label: label.replace("_", " "),
                    color: CHART_PALETTE[i % CHART_PALETTE.length],
                  })),
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            slotProps={{
              legend: {
                labelStyle: { fill: textColor, fontSize: 12 },
              },
            }}
          />
        </ChartCard>

        {/* Transaction Status */}
        <ChartCard
          title="Transaction Status"
          borderColor={borderColor}
          cardBg={cardBg}
        >
          <PieChart
            height={260}
            series={[
              {
                data: Object.entries(analytics.txStatusCounts)
                  .filter(([, v]) => v > 0)
                  .map(([label, value], i) => ({
                    id: label,
                    value,
                    label,
                    color: CHART_PALETTE[i % CHART_PALETTE.length],
                  })),
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            slotProps={{
              legend: {
                labelStyle: { fill: textColor, fontSize: 12 },
              },
            }}
          />
        </ChartCard>

        {/* Room Performance */}
        <ChartCard
          title="Top Room Revenue"
          borderColor={borderColor}
          cardBg={cardBg}
          span={2}
        >
          <BarChart
            height={280}
            layout="horizontal"
            series={[
              {
                data: analytics.roomPerformance.map((r) => r.revenue),
                label: "Revenue (₱)",
                color: c.success,
              },
            ]}
            yAxis={[
              {
                data: analytics.roomPerformance.map((r) => r.name),
                scaleType: "band",
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            xAxis={[
              {
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
          />
        </ChartCard>

        {/* Booking Type */}
        <ChartCard
          title="Booking Type"
          borderColor={borderColor}
          cardBg={cardBg}
        >
          <PieChart
            height={260}
            series={[
              {
                data: [
                  {
                    id: "overnight",
                    value: analytics.overnightCount,
                    label: "Overnight",
                    color: c.primary,
                  },
                  {
                    id: "short-stay",
                    value: analytics.shortStayCount,
                    label: "Short Stay",
                    color: c.info,
                  },
                ],
                innerRadius: 40,
                paddingAngle: 2,
                cornerRadius: 4,
              },
            ]}
            slotProps={{
              legend: {
                labelStyle: { fill: textColor, fontSize: 12 },
              },
            }}
          />
        </ChartCard>

        {/* Guest Demographics */}
        <ChartCard
          title="Guest Demographics"
          borderColor={borderColor}
          cardBg={cardBg}
        >
          <BarChart
            height={260}
            series={[
              {
                data: [
                  analytics.totalAdults,
                  analytics.totalChildren,
                  analytics.totalInfants,
                  analytics.totalDomestic,
                  analytics.totalForeign,
                ],
                label: "Count",
                color: c.info,
              },
            ]}
            xAxis={[
              {
                data: ["Adults", "Children", "Infants", "Domestic", "Foreign"],
                scaleType: "band",
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
          />
        </ChartCard>

        {/* Room Type Distribution */}
        <ChartCard
          title="Room Types"
          borderColor={borderColor}
          cardBg={cardBg}
          span={2}
        >
          <BarChart
            height={260}
            series={[
              {
                data: Object.values(analytics.roomTypeCounts),
                label: "Rooms",
                color: c.secondary,
              },
            ]}
            xAxis={[
              {
                data: Object.keys(analytics.roomTypeCounts),
                scaleType: "band",
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: textColor, fontSize: 11 },
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
          />
        </ChartCard>
      </Box>
    </PageContainer>
  );
};

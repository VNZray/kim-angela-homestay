import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/joy";
import { ArrowBack } from "@mui/icons-material";
import Typography from "@/components/ui/Typography";
import IconButton from "@/components/ui/IconButton";
import Loading from "@/components/Loading";
import Alert from "@/components/ui/Alert";
import StepIndicator from "./components/StepIndicator";
import PersonalInfoStep from "./components/PersonalInfoStep";
import GuestDetailsStep from "./components/GuestDetailsStep";
import BookingDetailsStep, {
  computeCheckOut,
} from "./components/BookingDetailsStep";
import BookingSuccess from "./components/BookingSuccess";
import { useAuth } from "@/context/AuthContext";
import { getRoomById } from "@/services/room/RoomService";
import {
  createBooking,
  checkRoomAvailability,
  createBookingGuests,
} from "@/services/booking/BookingService";
import {
  generateReferenceId,
  generateLocalId,
  saveLocalBooking,
} from "@/services/booking/LocalBookingService";
import { getTouristByFirebaseUid } from "@/services/tourist/TouristService";
import type { Room } from "@/types/Room";
import type {
  BookingGuestInfo,
  StayType,
  OvernightDuration,
} from "@/types/Booking";

const GUEST_STEPS = ["Personal Info", "Guest Details", "Booking Details"];
const AUTH_STEPS = ["Guest Details", "Booking Details"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-() ]{7,15}$/;

export default function BookRoom() {
  const { id: roomId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const steps = isAuthenticated ? AUTH_STEPS : GUEST_STEPS;

  const [currentStep, setCurrentStep] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState({
    referenceId: "",
    roomName: "",
    checkInDate: "",
    checkOutDate: "",
    totalPrice: 0,
  });

  // Alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "error" as "error" | "warning" | "info" | "success",
    title: "",
    message: "",
  });

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState<BookingGuestInfo[]>([
    { name: "", classification: "adult", age: null },
  ]);
  const [stayType, setStayType] = useState<StayType>("overnight");
  const [arrivalDate, setArrivalDate] = useState("");
  const [durationHours, setDurationHours] = useState(3);
  const [overnightDuration, setOvernightDuration] =
    useState<OvernightDuration>("1D2N");
  const [tripPurpose, setTripPurpose] = useState("leisure");
  const [foreignCounts, setForeignCounts] = useState(0);
  const [domesticCounts, setDomesticCounts] = useState(0);
  const [overseasCounts, setOverseasCounts] = useState(0);
  const [localCounts, setLocalCounts] = useState(0);

  // Pax = guests + 1 (the person making the booking)
  const pax = guests.length + 1;

  // Load room data
  useEffect(() => {
    if (!roomId) {
      navigate("/rooms");
      return;
    }
    const load = async () => {
      try {
        const data = await getRoomById(roomId);
        if (!data) {
          navigate("/rooms");
          return;
        }
        setRoom(data);
      } catch {
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [roomId, navigate]);

  // Pre-fill name/email for authenticated users
  useEffect(() => {
    if (user) {
      setFullName(user.displayName ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const showAlert = useCallback(
    (
      type: "error" | "warning" | "info" | "success",
      title: string,
      message: string,
    ) => {
      setAlertConfig({ type, title, message });
      setAlertOpen(true);
    },
    [],
  );

  // Validation
  const validatePersonalInfo = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!EMAIL_REGEX.test(email)) e.email = "Invalid email format";
    if (!phone.trim()) e.phone = "Contact number is required";
    else if (!PHONE_REGEX.test(phone)) e.phone = "Invalid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [fullName, email, phone]);

  const validateGuestDetails = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (guests.length === 0) e.guests = "At least one guest is required";
    guests.forEach((g, idx) => {
      if (!g.name.trim()) e[`guest_${idx}_name`] = "Guest name is required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [guests]);

  const validateBookingDetails = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!arrivalDate) e.arrivalDate = "Arrival date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [arrivalDate]);

  const handleNextStep = useCallback(() => {
    let valid = false;
    if (!isAuthenticated && currentStep === 0) {
      valid = validatePersonalInfo();
    } else if (
      (isAuthenticated && currentStep === 0) ||
      (!isAuthenticated && currentStep === 1)
    ) {
      valid = validateGuestDetails();
    }
    if (valid) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [
    isAuthenticated,
    currentStep,
    validatePersonalInfo,
    validateGuestDetails,
  ]);

  const handleBackStep = useCallback(() => {
    setErrors({});
    setCurrentStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFieldChange = useCallback(
    (field: string, value: string | number) => {
      switch (field) {
        case "fullName":
          setFullName(value as string);
          break;
        case "email":
          setEmail(value as string);
          break;
        case "phone":
          setPhone(value as string);
          break;
        case "stayType":
          setStayType(value as StayType);
          break;
        case "arrivalDate":
          setArrivalDate(value as string);
          break;
        case "durationHours":
          setDurationHours(value as number);
          break;
        case "overnightDuration":
          setOvernightDuration(value as OvernightDuration);
          break;
        case "tripPurpose":
          setTripPurpose(value as string);
          break;
        case "foreignCounts":
          setForeignCounts(value as number);
          break;
        case "domesticCounts":
          setDomesticCounts(value as number);
          break;
        case "overseasCounts":
          setOverseasCounts(value as number);
          break;
        case "localCounts":
          setLocalCounts(value as number);
          break;
      }
      // Clear field error on change
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  // Compute checkout info
  const { checkOutDate, checkOutTime, checkInTime } = useMemo(
    () =>
      computeCheckOut(arrivalDate, stayType, overnightDuration, durationHours),
    [arrivalDate, stayType, overnightDuration, durationHours],
  );

  const totalPrice = useMemo(() => {
    if (!room) return 0;
    if (stayType === "overnight") {
      const nightsMap: Record<OvernightDuration, number> = {
        "1D2N": 2,
        "2D3N": 3,
        "3D4N": 4,
        "4D5N": 5,
        "5D6N": 6,
        "6D7N": 7,
      };
      return (room.room_price ?? 0) * (nightsMap[overnightDuration] ?? 2);
    }
    return (room.per_hour_rate ?? 0) * durationHours;
  }, [room, stayType, overnightDuration, durationHours]);

  // Submit booking
  const handleSubmit = useCallback(async () => {
    if (!validateBookingDetails() || !room || !roomId) return;

    setSubmitting(true);
    try {
      // Check availability
      const available = await checkRoomAvailability(
        roomId,
        arrivalDate,
        checkOutDate,
      );
      if (!available) {
        showAlert(
          "warning",
          "Room Unavailable",
          "This room is not available for the selected dates. Please choose different dates.",
        );
        setSubmitting(false);
        return;
      }

      const refId = generateReferenceId();
      const roomName = `${room.room_type || "Room"}${room.room_number ? ` — ${room.room_number}` : ""}`;

      const nightsMap: Record<OvernightDuration, number> = {
        "1D2N": 2,
        "2D3N": 3,
        "3D4N": 4,
        "4D5N": 5,
        "5D6N": 6,
        "6D7N": 7,
      };

      if (isAuthenticated) {
        // Authenticated flow: save to database
        let touristId: string | null = null;
        if (user?.uid) {
          try {
            const tourist = await getTouristByFirebaseUid(user.uid);
            if (tourist) touristId = tourist.id;
          } catch {
            // Tourist profile may not exist
          }
        }

        const booking = await createBooking({
          reference_id: refId,
          pax,
          num_adults:
            guests.filter((g) => g.classification === "adult").length + 1,
          num_children: guests.filter((g) => g.classification === "minor")
            .length,
          num_infants: guests.filter(
            (g) =>
              g.classification === "infant" || g.classification === "toddler",
          ).length,
          foreign_counts: foreignCounts,
          domestic_counts: domesticCounts,
          overseas_counts: overseasCounts,
          local_counts: localCounts,
          trip_purpose: tripPurpose,
          booking_type: stayType,
          check_in_date: arrivalDate,
          check_out_date: checkOutDate,
          check_in_time: checkInTime,
          check_out_time: checkOutTime,
          duration_hours: stayType === "short-stay" ? durationHours : null,
          duration_nights:
            stayType === "overnight"
              ? (nightsMap[overnightDuration] ?? 2)
              : null,
          total_price: totalPrice,
          balance: totalPrice,
          booking_status: "pending",
          booking_source: "online",
          room_id: roomId,
          business_id: room.business_id ?? "",
          tourist: touristId,
          guest_name: fullName || user?.displayName || null,
          guest_email: email || user?.email || null,
          guest_phone: phone || null,
        });

        // Store guest records in guest table & link via booking_confirmation
        try {
          await createBookingGuests(booking.id, guests);
        } catch {
          // Non-blocking: booking is saved, guest records are supplementary
        }
      } else {
        // Guest flow: save to localStorage + database
        let bookingId: string | null = null;
        try {
          const booking = await createBooking({
            reference_id: refId,
            pax,
            num_adults:
              guests.filter((g) => g.classification === "adult").length + 1,
            num_children: guests.filter((g) => g.classification === "minor")
              .length,
            num_infants: guests.filter(
              (g) =>
                g.classification === "infant" || g.classification === "toddler",
            ).length,
            foreign_counts: foreignCounts,
            domestic_counts: domesticCounts,
            overseas_counts: overseasCounts,
            local_counts: localCounts,
            trip_purpose: tripPurpose,
            booking_type: stayType,
            check_in_date: arrivalDate,
            check_out_date: checkOutDate,
            check_in_time: checkInTime,
            check_out_time: checkOutTime,
            duration_hours: stayType === "short-stay" ? durationHours : null,
            duration_nights:
              stayType === "overnight"
                ? (nightsMap[overnightDuration] ?? 2)
                : null,
            total_price: totalPrice,
            balance: totalPrice,
            booking_status: "pending",
            booking_source: "online",
            room_id: roomId,
            business_id: room.business_id ?? "",
            tourist: null,
            guest_name: fullName,
            guest_email: email,
            guest_phone: phone,
          });
          bookingId = booking.id;
        } catch {
          // If DB save fails, still save locally so guest doesn't lose data
        }

        // Store guest records in guest table & link via booking_confirmation
        if (bookingId) {
          try {
            await createBookingGuests(bookingId, guests);
          } catch {
            // Non-blocking
          }
        }

        // Always save to localStorage for guest retrieval
        saveLocalBooking({
          id: generateLocalId(),
          referenceId: refId,
          fullName,
          email,
          phone,
          guests,
          roomId,
          roomName,
          roomNumber: room.room_number ?? "",
          stayType,
          arrivalDate,
          checkOutDate,
          checkInTime,
          checkOutTime,
          durationHours: stayType === "short-stay" ? durationHours : null,
          durationNights:
            stayType === "overnight"
              ? (nightsMap[overnightDuration] ?? 2)
              : null,
          pax,
          tripPurpose,
          foreignCounts,
          domesticCounts,
          overseasCounts,
          localCounts,
          totalPrice,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }

      setSuccessData({
        referenceId: refId,
        roomName,
        checkInDate: arrivalDate,
        checkOutDate,
        totalPrice,
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Booking submission failed:", err);
      showAlert(
        "error",
        "Booking Failed",
        "Something went wrong while submitting your booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    validateBookingDetails,
    room,
    roomId,
    arrivalDate,
    checkOutDate,
    checkInTime,
    checkOutTime,
    isAuthenticated,
    user,
    guests,
    stayType,
    durationHours,
    overnightDuration,
    totalPrice,
    pax,
    tripPurpose,
    foreignCounts,
    domesticCounts,
    overseasCounts,
    localCounts,
    fullName,
    email,
    phone,
    showAlert,
  ]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </Box>
    );
  }

  if (!room) return null;

  // Determine which content to show based on step
  const getStepContent = () => {
    if (success) {
      return (
        <BookingSuccess
          referenceId={successData.referenceId}
          roomName={successData.roomName}
          checkInDate={successData.checkInDate}
          checkOutDate={successData.checkOutDate}
          totalPrice={successData.totalPrice}
          isGuest={!isAuthenticated}
        />
      );
    }

    if (!isAuthenticated) {
      // Guest: 3 steps
      switch (currentStep) {
        case 0:
          return (
            <PersonalInfoStep
              fullName={fullName}
              email={email}
              phone={phone}
              onChange={handleFieldChange}
              errors={errors}
              onNext={handleNextStep}
            />
          );
        case 1:
          return (
            <GuestDetailsStep
              guests={guests}
              onChange={setGuests}
              errors={errors}
              onNext={handleNextStep}
              onBack={handleBackStep}
              isAuthenticated={false}
            />
          );
        case 2:
          return (
            <BookingDetailsStep
              room={room}
              stayType={stayType}
              arrivalDate={arrivalDate}
              durationHours={durationHours}
              overnightDuration={overnightDuration}
              tripPurpose={tripPurpose}
              foreignCounts={foreignCounts}
              domesticCounts={domesticCounts}
              overseasCounts={overseasCounts}
              localCounts={localCounts}
              pax={pax}
              onChange={handleFieldChange}
              errors={errors}
              onSubmit={handleSubmit}
              onBack={handleBackStep}
              submitting={submitting}
            />
          );
      }
    } else {
      // Authenticated: 2 steps
      switch (currentStep) {
        case 0:
          return (
            <GuestDetailsStep
              guests={guests}
              onChange={setGuests}
              errors={errors}
              onNext={handleNextStep}
              onBack={() => navigate(`/rooms/${roomId}`)}
              isAuthenticated={true}
            />
          );
        case 1:
          return (
            <BookingDetailsStep
              room={room}
              stayType={stayType}
              arrivalDate={arrivalDate}
              durationHours={durationHours}
              overnightDuration={overnightDuration}
              tripPurpose={tripPurpose}
              foreignCounts={foreignCounts}
              domesticCounts={domesticCounts}
              overseasCounts={overseasCounts}
              localCounts={localCounts}
              pax={pax}
              onChange={handleFieldChange}
              errors={errors}
              onSubmit={handleSubmit}
              onBack={handleBackStep}
              submitting={submitting}
            />
          );
      }
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        pt: { xs: 10, md: 12 },
        pb: { xs: 6, md: 10 },
      }}
    >
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        {/* Back button */}
        {!success && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <IconButton
              variant="outlined"
              colorScheme="dark"
              size="sm"
              onClick={() => navigate(`/rooms/${roomId}`)}
            >
              <ArrowBack sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography.Body size="sm" color="default">
              Back to Room
            </Typography.Body>
          </Box>
        )}

        {/* Page title */}
        <Typography.Header color="dark" size="sm" sx={{ mb: 1 }}>
          {success ? "Booking Confirmed" : "Book Your Stay"}
        </Typography.Header>
        {!success && (
          <Typography.Body color="default" size="sm" sx={{ mb: 3 }}>
            {room.room_type || "Room"}
            {room.room_number ? ` — Room ${room.room_number}` : ""}
          </Typography.Body>
        )}

        {/* Step indicator */}
        {!success && <StepIndicator steps={steps} currentStep={currentStep} />}

        {/* Step content */}
        {getStepContent()}
      </Box>

      {/* Alert */}
      <Alert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="OK"
        showCancel={false}
      />
    </Box>
  );
}

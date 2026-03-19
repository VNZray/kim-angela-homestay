import { Box, useColorScheme } from "@mui/joy";
import { useEffect, useRef, useState } from "react";
import Typography from "../../../components/ui/Typography";
import SectionHeader from "../../../components/SectionHeader";
import Card from "../../../components/ui/Card";
import { getColors } from "@/utils/Colors";
import { getActivePromotions } from "@/services/promotion/PromotionService";
import { getActiveDiscounts } from "@/services/discount/DiscountService";
import type { Promotion } from "@/types/Promotion";
import type { Discount } from "@/types/Discount";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CampaignIcon from "@mui/icons-material/Campaign";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const Promotions = () => {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promoData, discountData] = await Promise.all([
          getActivePromotions(),
          getActiveDiscounts(),
        ]);
        setPromotions(promoData);
        setDiscounts(discountData);
      } catch {
        // Silently fail - this is a non-critical section
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Don't render the section if there are no active promotions or discounts
  if (loading || (promotions.length === 0 && discounts.length === 0)) {
    return null;
  }

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        bgcolor: themeColors.odd,
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <SectionHeader
          title="Special Offers & Promotions"
          subtitle="Take advantage of our latest deals and exclusive offers"
        />

        {/* Active Discounts */}
        {discounts.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <LocalOfferIcon sx={{ color: themeColors.primary }} />
              <Typography.Header size="xs" color="primary">
                Current Discounts
              </Typography.Header>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2.5,
              }}
            >
              {discounts.slice(0, 6).map((discount, index) => (
                <Box
                  key={discount.id}
                  sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
                  }}
                >
                  <Card
                    colorScheme="light"
                    elevation={2}
                    sx={{
                      p: 3,
                      height: "100%",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: themeColors.success,
                          color: "#fff",
                          borderRadius: "12px",
                          px: 2,
                          py: 0.8,
                          fontWeight: 700,
                          fontSize: "1.2rem",
                        }}
                      >
                        {discount.discount_percentage}% OFF
                      </Box>
                      {discount.promo_code && (
                        <Box
                          sx={{
                            border: "2px dashed",
                            borderColor: themeColors.primary,
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.5,
                          }}
                        >
                          <Typography.Label size="sm" color="primary" bold>
                            {discount.promo_code}
                          </Typography.Label>
                        </Box>
                      )}
                    </Box>

                    <Typography.CardTitle size="sm" color="dark" sx={{ mb: 1 }}>
                      {discount.name}
                    </Typography.CardTitle>

                    {discount.description && (
                      <Typography.Body
                        size="sm"
                        color="default"
                        sx={{ mb: 2, opacity: 0.7 }}
                      >
                        {discount.description}
                      </Typography.Body>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        opacity: 0.6,
                      }}
                    >
                      <CalendarMonthIcon sx={{ fontSize: 16 }} />
                      <Typography.Body size="xs" color="default">
                        Valid until{" "}
                        {new Date(discount.end_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </Typography.Body>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Active Promotions */}
        {promotions.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <CampaignIcon sx={{ color: themeColors.primary }} />
              <Typography.Header size="xs" color="primary">
                Latest Promotions
              </Typography.Header>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {promotions.slice(0, 4).map((promo, index) => (
                <Box
                  key={promo.id}
                  sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + index * 0.15}s`,
                  }}
                >
                  <Card
                    colorScheme="light"
                    elevation={2}
                    sx={{
                      overflow: "hidden",
                      height: "100%",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    {promo.image_url && (
                      <Box
                        component="img"
                        src={promo.image_url}
                        alt={promo.title}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <Box sx={{ p: 3 }}>
                      {promo.is_featured && (
                        <Typography.Label
                          size="xs"
                          color="primary"
                          bold
                          sx={{ mb: 1, display: "block" }}
                        >
                          ★ FEATURED
                        </Typography.Label>
                      )}
                      <Typography.CardTitle
                        size="sm"
                        color="dark"
                        sx={{ mb: 1 }}
                      >
                        {promo.title}
                      </Typography.CardTitle>
                      <Typography.Body
                        size="sm"
                        color="default"
                        sx={{
                          mb: 2,
                          opacity: 0.7,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {promo.description}
                      </Typography.Body>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          opacity: 0.6,
                        }}
                      >
                        <CalendarMonthIcon sx={{ fontSize: 16 }} />
                        <Typography.Body size="xs" color="default">
                          {new Date(promo.start_date).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}{" "}
                          –{" "}
                          {new Date(promo.end_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </Typography.Body>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Promotions;

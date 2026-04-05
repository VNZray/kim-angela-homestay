import { getColors } from "@/utils/Colors";
import { Box, Select, Option, useColorScheme } from "@mui/joy";
import { Search, X } from "lucide-react";
import React, { useMemo, useState, useCallback } from "react";
import Table from "./Table";
import type { TableProps } from "./Table";
import Container from "../Container";
import Typography from "./Typography";
import Button from "./Button";

// Filter option for dropdowns
export interface FilterOption {
  value: string;
  label: string;
}

// Dropdown filter config
export interface DropdownFilterConfig {
  id: string;
  label: string;
  placeholder?: string;
  options: FilterOption[];
}

// Date filter config
export interface DateFilterConfig {
  id: string;
  label: string;
  placeholder?: string;
}

// FilterableTable Props
export interface FilterableTableProps<T = any> extends TableProps<T> {
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T, query: string) => boolean);
  dropdownFilters?: DropdownFilterConfig[];
  dateFilters?: DateFilterConfig[];
  filterCount?: 1 | 2 | 3 | 4;
  onSearchChange?: (value: string) => void;
  onDropdownFilterChange?: (filterId: string, value: string) => void;
  onDateFilterChange?: (filterId: string, value: string) => void;
}

function FilterableTable<T extends Record<string, any>>({
  searchPlaceholder = "Search...",
  searchKey,
  dropdownFilters = [],
  dateFilters = [],
  filterCount = 1,
  onSearchChange,
  onDropdownFilterChange,
  onDateFilterChange,
  data,
  ...tableProps
}: FilterableTableProps<T>) {
  const { mode } = useColorScheme();
  const themeColors = getColors(mode);
  const isDark = mode === "dark";
  const borderColor = isDark ? "#374151" : "#E5E7EB";

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownValues, setDropdownValues] = useState<Record<string, string>>(
    {},
  );
  const [dateValues, setDateValues] = useState<Record<string, string>>({});

  // Limit filters to filterCount
  const activeDropdowns = dropdownFilters.slice(0, filterCount);
  const remainingSlots = filterCount - activeDropdowns.length;
  const activeDateFilters = dateFilters.slice(0, Math.max(0, remainingSlots));

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    onSearchChange?.("");
  }, [onSearchChange]);

  const handleDropdownChange = useCallback(
    (filterId: string, value: string | null) => {
      const newValue = value ?? "";
      setDropdownValues((prev) => ({ ...prev, [filterId]: newValue }));
      onDropdownFilterChange?.(filterId, newValue);
    },
    [onDropdownFilterChange],
  );

  const handleDateChange = useCallback(
    (filterId: string, value: string) => {
      setDateValues((prev) => ({ ...prev, [filterId]: value }));
      onDateFilterChange?.(filterId, value);
    },
    [onDateFilterChange],
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setDropdownValues({});
    setDateValues({});
    onSearchChange?.("");
    activeDropdowns.forEach((f) => onDropdownFilterChange?.(f.id, ""));
    activeDateFilters.forEach((f) => onDateFilterChange?.(f.id, ""));
  }, [
    onSearchChange,
    onDropdownFilterChange,
    onDateFilterChange,
    activeDropdowns,
    activeDateFilters,
  ]);

  // Client-side filtering
  const filteredData = useMemo(() => {
    let result = data;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) => {
        if (typeof searchKey === "function") {
          return searchKey(row, query);
        }
        if (searchKey) {
          const value = row[searchKey];
          return String(value ?? "")
            .toLowerCase()
            .includes(query);
        }
        // Default: search all string fields
        return Object.values(row).some((val) =>
          String(val ?? "")
            .toLowerCase()
            .includes(query),
        );
      });
    }

    // Dropdown filters
    activeDropdowns.forEach((filter) => {
      const selectedValue = dropdownValues[filter.id];
      if (selectedValue) {
        result = result.filter(
          (row) => String(row[filter.id] ?? "") === selectedValue,
        );
      }
    });

    // Date filters
    activeDateFilters.forEach((filter) => {
      const selectedDate = dateValues[filter.id];
      if (selectedDate) {
        result = result.filter((row) => {
          const rowDate = row[filter.id];
          if (!rowDate) return false;
          const rowDateStr = new Date(rowDate).toISOString().split("T")[0];
          return rowDateStr === selectedDate;
        });
      }
    });

    return result;
  }, [
    data,
    searchQuery,
    searchKey,
    dropdownValues,
    dateValues,
    activeDropdowns,
    activeDateFilters,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    Object.values(dropdownValues).some((v) => v !== "") ||
    Object.values(dateValues).some((v) => v !== "");

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 1rem",
    fontSize: "clamp(0.8rem, 1.5vw, 0.875rem)",
    border: `1px solid ${borderColor}`,
    borderRadius: "8px",
    outline: "none",
    backgroundColor: isDark ? "#1e1e1e" : "#FFFFFF",
    color: isDark ? "#f5f5f5" : "#1a1a1a",
    transition: "border-color 0.2s ease",
  };

  return (
    <Container gap="0" padding="0">
      {/* Toolbar: Search + Filters */}
      <Container
        padding="16px"
        gap="12px"
        style={{
          borderBottom: `1px solid ${borderColor}`,
          borderRadius: "8px 8px 0 0",
        }}
        background="primary"
      >
        {/* Search Bar */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              color: isDark ? "#9CA3AF" : "#6B7280",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            style={{
              ...inputStyle,
              paddingLeft: "40px",
              paddingRight: searchQuery ? "36px" : "1rem",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = themeColors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = borderColor;
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                color: isDark ? "#9CA3AF" : "#6B7280",
              }}
            >
              <X size={16} />
            </button>
          )}
        </Box>

        {/* Filters Row */}
        {(activeDropdowns.length > 0 || activeDateFilters.length > 0) && (
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "flex-end",
            }}
          >
            {/* Dropdown Filters */}
            {activeDropdowns.map((filter) => (
              <Box
                key={filter.id}
                sx={{ flex: "1 1 180px", minWidth: "150px" }}
              >
                <Typography.Label>{filter.label}</Typography.Label>
                <Select
                  placeholder={filter.placeholder ?? "All"}
                  value={dropdownValues[filter.id] || null}
                  onChange={(_e, newValue) =>
                    handleDropdownChange(filter.id, newValue)
                  }
                  size="sm"
                  sx={{
                    mt: "4px",
                    borderRadius: "8px",
                    fontSize: "clamp(0.8rem, 1.5vw, 0.875rem)",
                    backgroundColor: isDark ? "#1e1e1e" : "#FFFFFF",
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <Option value="">All</Option>
                  {filter.options.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              </Box>
            ))}

            {/* Date Filters */}
            {activeDateFilters.map((filter) => (
              <Box
                key={filter.id}
                sx={{ flex: "1 1 180px", minWidth: "150px" }}
              >
                <Typography.Label>{filter.label}</Typography.Label>
                <input
                  type="date"
                  value={dateValues[filter.id] || ""}
                  onChange={(e) => handleDateChange(filter.id, e.target.value)}
                  style={{
                    ...inputStyle,
                    marginTop: "4px",
                    cursor: "pointer",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = themeColors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = borderColor;
                  }}
                />
              </Box>
            ))}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Box sx={{ display: "flex", alignItems: "flex-end", pb: "2px" }}>
                <Button
                  variant="soft"
                  colorScheme="primary"
                  size="sm"
                  onClick={clearAllFilters}
                  startDecorator={<X size={14} />}
                >
                  Clear
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Table */}
      <Table {...tableProps} data={filteredData} />
    </Container>
  );
}

export default FilterableTable;

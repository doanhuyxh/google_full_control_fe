import { theme as antdTheme } from "antd";

const { defaultAlgorithm } = antdTheme;

const antdConfig = {
  algorithm: defaultAlgorithm, // đổi sang darkAlgorithm nếu muốn giao diện tối
  token: {
    // 🌈 Token cơ bản - Bootstrap Primary Color
    colorPrimary: "#007bff", // màu chủ đạo Bootstrap primary
    colorBgBase: "#ffffff",
    colorTextBase: "#000000",

    // 🌿 Nâng cao (tùy chọn)
    fontSize: 14,
    borderRadius: 8,
    colorBgContainer: "#ffffff",
    colorBorder: "#d9d9d9"
  },
  components: {
    Layout: {
      bodyBg: "#ffffff",
      headerBg: "#ffffff",
      siderBg: "#ffffff",
      triggerBg: "#f5f5f5",
      triggerColor: "#000000",
      headerHeight: 64
    },
    Menu: {
      itemBg: "#ffffff",
      itemBgHover: "#f5f5f5",
      itemBgSelected: "#cce7ff", // màu nền selected phù hợp với bootstrap primary
      itemText: "#000000",
      itemTextHover: "#000000",
      itemTextSelected: "#007bff", // màu text selected bootstrap primary
      itemBorderRadius: 6,
      itemHeight: 40
    },
    Button: {
      borderRadius: 6,
      colorPrimaryHover: "#0056b3", // bootstrap primary hover
      colorPrimaryActive: "#004085" // bootstrap primary active
    },
    Input: {
      borderRadius: 6,
      colorBorder: "#d9d9d9",
      colorBgContainer: "#ffffff"
    },
    Card: {
      borderRadiusLG: 12,
      colorBgContainer: "#ffffff",
      boxShadowTertiary: "0 2px 8px rgba(0,0,0,0.05)"
    },
    Table: {
      // 📊 Màu sắc cơ bản
      colorBgContainer: "#ffffff", // màu nền table
      colorFillAlter: "#fafafa", // màu nền dòng xen kẽ
      colorBorderSecondary: "#f0f0f0", // màu border
      
      // 🎨 Màu text
      colorText: "#000000", // màu text chính
      colorTextHeading: "#000000", // màu text header
      
      // 📏 Kích thước và padding
      borderRadiusLG: 8, // bo góc table quy
      cellPaddingBlock: 12, // padding dọc trong cell
      cellPaddingInline: 16, // padding ngang trong cell
      
      // 📐 Header
      headerBg: "#0046FF", // màu nền header
      headerColor: "#ffffff", // màu text header
      headerSortActiveBg: "#cce7ff", // màu nền header khi sort active (bootstrap primary light)
      headerSortHoverBg: "#f5f5f5", // màu nền header khi hover
      
      // ✨ Hover và Selection
      rowHoverBg: "#f5f5f5", // màu nền khi hover row
      rowSelectedBg: "#cce7ff", // màu nền khi select row (bootstrap primary light)
      rowSelectedHoverBg: "#99d6ff", // màu nền khi hover row đã select (bootstrap primary lighter)
      
      // 🔧 Filter
      filterDropdownBg: "#ffffff" // màu nền filter dropdown
    },
    Modal: {
      // 🪟 Nền và border
      colorBgContainer: "#ffffff", // màu nền modal
      colorBgMask: "rgba(0, 0, 0, 0.45)", // màu nền overlay (mask)
      borderRadiusLG: 12, // bo góc modal
      
      // 📏 Kích thước
      paddingContentHorizontal: 24, // padding ngang content
      paddingContentVertical: 20, // padding dọc content
      
      // 🎯 Header
      titleColor: "#000000", // màu text title
      titleFontSize: 18, // kích thước font title
      
      // 🔘 Close button
      colorIcon: "#666666", // màu icon close
      colorIconHover: "#000000", // màu icon close khi hover
      
      // 📱 Footer
      footerBg: "#ffffff", // màu nền footer
      
      // 🎨 Border và shadow
      boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)"
    }
  }
};

export default antdConfig;

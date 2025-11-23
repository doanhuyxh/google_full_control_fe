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
      itemBgSelected: "#cce7ff",
      itemText: "#000000",
      itemTextHover: "#000000",
      itemTextSelected: "#007bff",
      itemBorderRadius: 6,
      itemHeight: 40
    },
    Button: {
      borderRadius: 6,
      colorPrimaryHover: "#0056b3",
      colorPrimaryActive: "#004085"
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
      colorBgContainer: "#ffffff",
      colorFillAlter: "#fafafa",
      colorBorderSecondary: "#f0f0f0",
      
      
      colorText: "#000000",
      colorTextHeading: "#000000",
      
      
      borderRadiusLG: 8,
      cellPaddingBlock: 12, 
      cellPaddingInline: 16, 
      
      headerBg: "#0046FF",
      headerColor: "#ffffff",
      headerSortActiveBg: "#cce7ff",
      headerSortHoverBg: "#f5f5f5",
      
      rowHoverBg: "#f5f5f5", 
      rowSelectedBg: "#cce7ff", 
      rowSelectedHoverBg: "#99d6ff", 
      
      filterDropdownBg: "#ffffff" 
    },
    Modal: {
      colorBgContainer: "#ffffff",
      colorBgMask: "rgba(0, 0, 0, 0.45)",
      borderRadiusLG: 12,
      
      paddingContentHorizontal: 24,
      paddingContentVertical: 20,
      
      titleColor: "#000000",
      titleFontSize: 18,
      
      
      colorIcon: "#666666", 
      colorIconHover: "#000000", 
      
      footerBg: "#ffffff", 
      
      boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)"
    }
  }
};

export default antdConfig;

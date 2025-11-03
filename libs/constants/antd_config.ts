import { theme as antdTheme } from "antd";

const { defaultAlgorithm } = antdTheme;

const antdConfig = {
  algorithm: defaultAlgorithm, // đổi sang darkAlgorithm nếu muốn giao diện tối
  token: {
    // 🌈 Token cơ bản
    colorPrimary: "#1677ff", // màu chủ đạo
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
      itemBgSelected: "#e6f4ff",
      itemText: "#000000",
      itemTextHover: "#000000",
      itemTextSelected: "#1677ff",
      itemBorderRadius: 6,
      itemHeight: 40
    },
    Button: {
      borderRadius: 6,
      colorPrimaryHover: "#4096ff",
      colorPrimaryActive: "#0958d9"
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
    }
  }
};

export default antdConfig;

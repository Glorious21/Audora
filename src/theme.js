import { createTheme } from "@mui/material/styles";

/** MUI theme tuned to Audora's light tokens — used for form controls. */
export const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#fbfbfd", paper: "#ffffff" },
    primary: { main: "#2f6fed", contrastText: "#ffffff" },
    text: { primary: "#0d0e12", secondary: "#545a68" },
    divider: "#e7e8ee",
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter Variable", system-ui, sans-serif',
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          fontSize: 13.5,
          "& fieldset": { borderColor: "#d7d9e2" },
          "&:hover fieldset": { borderColor: "#b6bac6" },
          "&.Mui-focused fieldset": { borderColor: "#2f6fed", borderWidth: 1 },
        },
        input: { "&::placeholder": { color: "#8a909e", opacity: 1 } },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 13.5, "&.Mui-focused": { color: "#2f6fed" } },
      },
    },
    MuiMenuItem: { styleOverrides: { root: { fontSize: 13.5 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiFormHelperText: { styleOverrides: { root: { fontSize: 11 } } },
  },
});

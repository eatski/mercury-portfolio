import { style } from "@vanilla-extract/css";

export const app = style({
  color: "#022C43",
  padding: "12px",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
});

const MEDIAQUERY_SP = "screen and (max-width: 768px)";

export const main = style({
  display: "flex",
  gap: "12px",
  flexGrow: 1,
  marginTop: "12px",
  "@media": {
    [MEDIAQUERY_SP]: {
      flexDirection: "column",
      height: "auto",
      width: "100%",
    },
  },
});

export const textarea = style({
  width: "240px",
  height: "100%",
  padding: "12px",
  "@media": {
    [MEDIAQUERY_SP]: {
      width: "100%",
      height: "240px",
    },
  },
});

export const jsonContainer = style({
  width: "360px",
  flexGrow: 1,
  border: "1px solid #022C43",
  overflow: "scroll",
  padding: "12px",
  background: "#F5F5F5",
  "@media": {
    [MEDIAQUERY_SP]: {
      width: "100%",
    },
  },
});

export const json = style({
  fontSize: "14px",
  margin: 0,
  whiteSpace: "pre-wrap",
});

export const controlls = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
});

export const buttons = style({
  display: "flex",
  gap: "8px",
});

export const switzh = style({
  fontSize: "16px",
});

export const logDisplay = style({
  border: "1px solid #022C43",
  overflow: "scroll",
  padding: "12px",
  background: "#F5F5F5",
  fontSize: "14px",
  width: "600px",
  "@media": {
    [MEDIAQUERY_SP]: {
      width: "100%",
    },
  },
});

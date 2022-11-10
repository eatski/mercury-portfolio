import { style } from '@vanilla-extract/css';

export const app = style({
    color: "#022C43",
    padding: "12px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",

})

export const main = style({
    display: "flex",
    gap: "12px",
    flexGrow: 1,
    justifyContent: "center",
})

export const textarea = style({
    width: "260px",
    height: "100%",
    padding: "12px",
})

export const json = style({
    width: "440px",
    fontSize: "14px",
    padding: "12px",
    margin: 0,
    border: "1px solid #022C43",
    whiteSpace: "pre-wrap",
})

export const buttons = style({
    display: "flex",
    gap: "8px",
    flexDirection: "column",
    width: "120px",
})

export const switzh = style({
    width: "100%",
})
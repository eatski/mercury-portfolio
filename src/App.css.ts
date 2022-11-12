import { style } from '@vanilla-extract/css';

export const app = style({
    color: "#022C43",
    padding: "12px",

})

export const main = style({
    display: "flex",
    gap: "12px",
    height: "600px",
    justifyContent: "center",
})

export const textarea = style({
    width: "260px",
    height: "100%",
    padding: "12px",
})

export const jsonContainer = style({
    width: "440px",
    border: "1px solid #022C43",
    overflow: "scroll",
    padding: "12px",
    background: "#F5F5F5",
})

export const json = style({
    width: "440px",
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",

})

export const buttons = style({
    display: "flex",
    gap: "8px",
    flexDirection: "column",
    width: "200px",
})

export const switzh = style({
    width: "100%",
})
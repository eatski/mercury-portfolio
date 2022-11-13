import { style } from '@vanilla-extract/css';

export const app = style({
    color: "#022C43",
    padding: "12px",

})

export const main = style({
    display: "flex",
    gap: "12px",
    height: "600px",
    marginTop: "12px",
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
    fontSize: "14px",
    margin: 0,
    whiteSpace: "pre-wrap",

})

export const controlls = style({
    display: "flex",
    gap: "8px",
})

export const buttons = style({
    display: "flex",
    gap: "8px",
})

export const switzh = style({
    width: "100px",
})

export const logDisplay = style({
    border: "1px solid #022C43",
    overflow: "scroll",
    padding: "12px",
    background: "#F5F5F5",
    fontSize: "14px",
    width: "500px"
})